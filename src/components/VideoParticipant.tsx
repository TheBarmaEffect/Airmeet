import React, { useEffect, useRef } from 'react';
import type { Participant } from '../types/meeting';

interface VideoParticipantProps {
  participant: Participant;
}

export function VideoParticipant({ participant }: VideoParticipantProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  useEffect(() => {
    if (!participant.backgroundBlur && !participant.virtualBackground) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !participant.stream) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawFrame = async () => {
      if (!video || !ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (participant.backgroundBlur) {
        // Apply blur effect
        ctx.filter = 'blur(10px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
      } else if (participant.virtualBackground && typeof participant.virtualBackground === 'string') {
        // Draw virtual background
        const img = new Image();
        img.src = participant.virtualBackground;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [participant.backgroundBlur, participant.virtualBackground, participant.stream]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={participant.id === 'local'}
        className={`w-full h-full object-cover ${
          participant.backgroundBlur || participant.virtualBackground ? 'hidden' : ''
        }`}
      />
      
      {(participant.backgroundBlur || participant.virtualBackground) && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {participant.screenShare && (
        <video
          ref={(ref) => {
            if (ref) {
              ref.srcObject = participant.screenShare!;
              ref.muted = participant.id === 'local';
            }
          }}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        {participant.isActiveSpeaker && (
          <div className="bg-green-500 px-2 py-1 rounded text-xs text-white">
            Speaking
          </div>
        )}
        {!participant.videoEnabled && (
          <div className="bg-red-500 px-2 py-1 rounded text-xs text-white">
            Video Off
          </div>
        )}
        {!participant.audioEnabled && (
          <div className="bg-red-500 px-2 py-1 rounded text-xs text-white">
            Muted
          </div>
        )}
      </div>
    </div>
  );
}