import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoGrid } from '../components/VideoGrid';
import { Controls } from '../components/Controls';
import { Chat } from '../components/Chat';
import { MeetingInfo } from '../components/MeetingInfo';
import { Logo } from '../components/Logo';
import { ParticipantsList } from '../components/ParticipantsList';
import { DeviceSettings } from '../components/DeviceSettings';
import { MeetingTimer } from '../components/MeetingTimer';
import { MeetingNotes } from '../components/MeetingNotes';
import { Reactions } from '../components/Reactions';
import { VirtualBackground } from '../components/VirtualBackground';
import { useWebRTC } from '../hooks/useWebRTC';
import type { Message, LayoutMode } from '../types/meeting';
import { v4 as uuidv4 } from 'uuid';
import { Layout, Settings, Radio, FileText } from 'lucide-react';

export function Meeting() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isVirtualBgOpen, setIsVirtualBgOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [meetingName, setMeetingName] = useState(
    id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
  
  const {
    participants,
    toggleVideo,
    toggleAudio,
    shareScreen,
    localParticipantId,
    error,
    isConnecting,
    setBackgroundBlur,
    setVirtualBackground,
    toggleNoiseReduction,
    isNoiseReductionEnabled,
  } = useWebRTC(id);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
  }, [id, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const localParticipant = participants.find(p => p.id === localParticipantId);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      senderId: localParticipantId,
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleVirtualBackground = (background: string | null) => {
    if (background === 'blur') {
      setBackgroundBlur(true);
      setVirtualBackground(null);
    } else {
      setBackgroundBlur(false);
      setVirtualBackground(background);
    }
    setIsVirtualBgOpen(false);
  };

  const toggleHand = () => {
    if (raisedHands.has(localParticipantId)) {
      raisedHands.delete(localParticipantId);
    } else {
      raisedHands.add(localParticipantId);
    }
    setRaisedHands(new Set(raisedHands));
  };

  const handleReaction = (emoji: string) => {
    // Broadcast reaction to other participants
    handleSendMessage(`Reacted with ${emoji}`);
  };

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Joining Meeting...
          </h2>
          <p className="text-gray-500">
            Setting up your audio and video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Recording</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
        <Logo className="text-gray-800" />
        <div className="h-6 w-px bg-gray-300" />
        <h1 className="text-lg font-medium text-gray-800">{meetingName}</h1>
        <MeetingTimer />
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        <button
          onClick={() => setIsNotesOpen(!isNotesOpen)}
          className="p-2 hover:bg-gray-200 rounded-full"
          title="Meeting Notes"
        >
          <FileText className="w-5 h-5" />
        </button>
        <button
          onClick={() => setLayoutMode(prev => 
            prev === 'grid' ? 'spotlight' : prev === 'spotlight' ? 'sidebar' : 'grid'
          )}
          className="p-2 hover:bg-gray-200 rounded-full"
          title="Change layout"
        >
          <Layout className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-gray-200 rounded-full"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <MeetingInfo meetingId={id} />

      <main className="flex-1 overflow-hidden flex">
        <VideoGrid
          participants={participants}
          layoutMode={layoutMode}
          activeSpeaker={participants.find(p => p.isActiveSpeaker)}
        />
        
        {isParticipantsOpen && (
          <ParticipantsList
            participants={participants}
            raisedHands={raisedHands}
          />
        )}
      </main>

      <Controls
        videoEnabled={localParticipant?.videoEnabled ?? false}
        audioEnabled={localParticipant?.audioEnabled ?? false}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onShareScreen={shareScreen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onToggleHand={toggleHand}
        isHandRaised={raisedHands.has(localParticipantId)}
        participantCount={participants.length}
        onToggleBackground={() => setIsVirtualBgOpen(true)}
        onToggleNoiseReduction={toggleNoiseReduction}
        isNoiseReductionEnabled={isNoiseReductionEnabled}
      />

      <Chat
        messages={messages}
        onSendMessage={handleSendMessage}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <MeetingNotes
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      <Reactions onSendReaction={handleReaction} />

      {isSettingsOpen && (
        <DeviceSettings
          onClose={() => setIsSettingsOpen(false)}
          onDeviceChange={() => {}}
        />
      )}

      {isVirtualBgOpen && (
        <VirtualBackground
          onSelectBackground={handleVirtualBackground}
          onClose={() => setIsVirtualBgOpen(false)}
        />
      )}
    </div>
  );
}