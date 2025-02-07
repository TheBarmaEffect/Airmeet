import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import type { Participant } from '../types/meeting';

// Get the current hostname and port for WebContainer environment
const currentHost = window.location.hostname;
const currentPort = '3001';
const SIGNALING_SERVER = `http://${currentHost}:${currentPort}`;

// Enhanced ICE servers configuration for better connectivity
const PC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
  iceTransportPolicy: 'all',
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

interface PeerConnection {
  peer: Peer.Instance;
  participantId: string;
}

export function useWebRTC(roomId: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isNoiseReductionEnabled, setIsNoiseReductionEnabled] = useState(true);
  
  const socketRef = useRef<Socket>();
  const localId = useRef(uuidv4());
  const peersRef = useRef<PeerConnection[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const createPeer = useCallback((targetId: string, stream: MediaStream, initiator: boolean) => {
    console.log(`Creating peer connection with ${targetId}, initiator: ${initiator}`);
    
    const peer = new Peer({
      initiator,
      trickle: true, // Enable trickle ICE for faster connection
      stream,
      config: PC_CONFIG,
      sdpTransform: (sdp) => {
        // Modify SDP to force high quality video
        return sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=2048000');
      }
    });

    peer.on('signal', signal => {
      console.log('Sending signal to', targetId);
      socketRef.current?.emit('signal', {
        signal,
        to: targetId,
        from: localId.current,
      });
    });

    peer.on('connect', () => {
      console.log('Peer connection established with', targetId);
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      console.log('Received stream from', targetId);
      setParticipants(prev => 
        prev.map(p => 
          p.id === targetId 
            ? { ...p, stream: remoteStream }
            : p
        )
      );
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setError('Connection error. Attempting to reconnect...');
      // Attempt to recreate the peer connection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          removePeer(targetId);
          if (localStreamRef.current) {
            const newPeer = createPeer(targetId, localStreamRef.current, true);
            addPeer(targetId, newPeer);
          }
        }, 1000 * reconnectAttempts.current);
      }
    });

    peer.on('close', () => {
      console.log('Peer connection closed with', targetId);
      removePeer(targetId);
    });

    return peer;
  }, []);

  const addPeer = useCallback((participantId: string, peer: Peer.Instance) => {
    console.log('Adding peer:', participantId);
    if (!peersRef.current.find(p => p.participantId === participantId)) {
      peersRef.current.push({
        peer,
        participantId,
      });
    }
  }, []);

  const removePeer = useCallback((participantId: string) => {
    console.log('Removing peer:', participantId);
    const peerConnection = peersRef.current.find(p => p.participantId === participantId);
    if (peerConnection) {
      peerConnection.peer.destroy();
      peersRef.current = peersRef.current.filter(p => p.participantId !== participantId);
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    }
  }, []);

  const setBackgroundBlur = useCallback((enabled: boolean) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === localId.current
          ? { ...p, backgroundBlur: enabled, virtualBackground: null }
          : p
      )
    );
  }, []);

  const setVirtualBackground = useCallback((background: string | null) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === localId.current
          ? { ...p, virtualBackground: background, backgroundBlur: false }
          : p
      )
    );
  }, []);

  const toggleNoiseReduction = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        const constraints = {
          noiseSuppression: !isNoiseReductionEnabled,
          echoCancellation: true,
          autoGainControl: true,
        };
        
        audioTrack.applyConstraints({ advanced: [constraints] });
        setIsNoiseReductionEnabled(!isNoiseReductionEnabled);
      }
    }
  }, [localStream, isNoiseReductionEnabled]);

  useEffect(() => {
    socketRef.current = io(SIGNALING_SERVER, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    const init = async () => {
      try {
        setIsConnecting(true);
        console.log('Initializing media devices...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 60, min: 30 },
            facingMode: 'user',
            aspectRatio: { ideal: 16/9 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            sampleSize: 16,
            channelCount: 2,
          },
        });

        // Apply constraints to video track for high quality
        const videoTrack = stream.getVideoTracks()[0];
        await videoTrack.applyConstraints({
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 }
        });
        
        localStreamRef.current = stream;
        setLocalStream(stream);
        setParticipants([
          {
            id: localId.current,
            stream,
            videoEnabled: true,
            audioEnabled: true,
          },
        ]);

        console.log('Joining room:', roomId);
        socketRef.current?.emit('join-room', {
          roomId,
          participantId: localId.current,
        });

        socketRef.current?.on('participant-joined', ({ participantId, participants: roomParticipants }) => {
          console.log('Participant joined:', participantId);
          if (participantId !== localId.current && localStreamRef.current) {
            const peer = createPeer(participantId, localStreamRef.current, true);
            addPeer(participantId, peer);
            
            setParticipants(prev => [
              ...prev,
              {
                id: participantId,
                videoEnabled: true,
                audioEnabled: true,
              },
            ]);
          }
        });

        socketRef.current?.on('participant-left', ({ participantId }) => {
          console.log('Participant left:', participantId);
          removePeer(participantId);
        });

        socketRef.current?.on('signal', ({ from, signal }) => {
          console.log('Received signal from:', from);
          const peerConnection = peersRef.current.find(p => p.participantId === from);
          
          if (peerConnection) {
            peerConnection.peer.signal(signal);
          } else if (localStreamRef.current) {
            const peer = createPeer(from, localStreamRef.current, false);
            addPeer(from, peer);
            peer.signal(signal);
          }
        });

        socketRef.current?.on('media-state-updated', ({ participantId, type, enabled }) => {
          setParticipants(prev =>
            prev.map(p =>
              p.id === participantId
                ? {
                    ...p,
                    [type === 'video' ? 'videoEnabled' : 'audioEnabled']: enabled,
                  }
                : p
            )
          );
        });

        socketRef.current?.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setError('Failed to connect to the signaling server. Please try again.');
        });

        setIsConnecting(false);
      } catch (error) {
        setIsConnecting(false);
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            setError('Please allow camera and microphone access to join the meeting.');
          } else if (error.name === 'OverconstrainedError') {
            // Fallback to lower quality if device doesn't support 1080p
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  frameRate: { ideal: 30 },
                },
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                },
              });
              localStreamRef.current = stream;
              setLocalStream(stream);
              setParticipants([
                {
                  id: localId.current,
                  stream,
                  videoEnabled: true,
                  audioEnabled: true,
                },
              ]);
            } catch (fallbackError) {
              setError('Failed to access media devices. Please check your camera and microphone.');
            }
          } else {
            setError('Failed to access media devices. Please check your camera and microphone.');
          }
        }
        console.error('Error accessing media devices:', error);
      }
    };

    init();

    return () => {
      console.log('Cleaning up WebRTC connections...');
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peersRef.current.forEach(({ peer }) => peer.destroy());
      socketRef.current?.disconnect();
    };
  }, [roomId, createPeer, addPeer, removePeer]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setParticipants(prev =>
          prev.map(p =>
            p.id === localId.current
              ? { ...p, videoEnabled: videoTrack.enabled }
              : p
          )
        );

        // Notify other participants
        socketRef.current?.emit('media-state-change', {
          roomId,
          participantId: localId.current,
          type: 'video',
          enabled: videoTrack.enabled,
        });
      }
    }
  }, [localStream, roomId]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setParticipants(prev =>
          prev.map(p =>
            p.id === localId.current
              ? { ...p, audioEnabled: audioTrack.enabled }
              : p
          )
        );

        // Notify other participants
        socketRef.current?.emit('media-state-change', {
          roomId,
          participantId: localId.current,
          type: 'audio',
          enabled: audioTrack.enabled,
        });
      }
    }
  }, [localStream, roomId]);

  const shareScreen = useCallback(async (): Promise<boolean> => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      
      setParticipants(prev =>
        prev.map(p =>
          p.id === localId.current
            ? { ...p, screenShare: screenStream }
            : p
        )
      );

      // Share screen with all peers
      peersRef.current.forEach(({ peer }) => {
        screenStream.getTracks().forEach(track => {
          peer.addTrack(track, screenStream);
        });
      });

      screenStream.getVideoTracks()[0].onended = () => {
        setParticipants(prev =>
          prev.map(p =>
            p.id === localId.current
              ? { ...p, screenShare: undefined }
              : p
          )
        );
        
        peersRef.current.forEach(({ peer }) => {
          screenStream.getTracks().forEach(track => {
            peer.removeTrack(track);
          });
        });
      };

      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Screen sharing was denied. Please allow access to share your screen.');
        } else {
          setError('An error occurred while trying to share your screen.');
        }
      }
      console.error('Error sharing screen:', error);
      return false;
    }
  }, []);

  return {
    participants,
    toggleVideo,
    toggleAudio,
    shareScreen,
    localParticipantId: localId.current,
    error,
    isConnecting,
    setBackgroundBlur,
    setVirtualBackground,
    toggleNoiseReduction,
    isNoiseReductionEnabled,
  };
}