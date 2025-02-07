import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageCircle,
  Users,
  Hand,
  Radio,
  Image,
  VolumeX,
  Volume2,
} from 'lucide-react';

interface ControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onShareScreen: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleRecording: () => void;
  onToggleHand: () => void;
  onToggleBackground: () => void;
  onToggleNoiseReduction: () => void;
  isHandRaised: boolean;
  participantCount: number;
  isNoiseReductionEnabled: boolean;
}

export function Controls({
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
  onToggleChat,
  onToggleParticipants,
  onToggleRecording,
  onToggleHand,
  onToggleBackground,
  onToggleNoiseReduction,
  isHandRaised,
  participantCount,
  isNoiseReductionEnabled,
}: ControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t flex items-center justify-center space-x-4">
      <button
        onClick={onToggleAudio}
        className={`p-4 rounded-full ${
          audioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {audioEnabled ? (
          <Mic className="w-6 h-6" />
        ) : (
          <MicOff className="w-6 h-6 text-white" />
        )}
      </button>
      
      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full ${
          videoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {videoEnabled ? (
          <Video className="w-6 h-6" />
        ) : (
          <VideoOff className="w-6 h-6 text-white" />
        )}
      </button>
      
      <button
        onClick={onShareScreen}
        className="p-4 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Monitor className="w-6 h-6" />
      </button>

      <button
        onClick={onToggleBackground}
        className="p-4 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Image className="w-6 h-6" />
      </button>

      <button
        onClick={onToggleNoiseReduction}
        className={`p-4 rounded-full ${
          isNoiseReductionEnabled ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {isNoiseReductionEnabled ? (
          <Volume2 className="w-6 h-6 text-blue-600" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={onToggleHand}
        className={`p-4 rounded-full ${
          isHandRaised ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <Hand className="w-6 h-6" />
      </button>
      
      <button
        onClick={onToggleRecording}
        className="p-4 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Radio className="w-6 h-6" />
      </button>

      <button
        onClick={onToggleParticipants}
        className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 relative"
      >
        <Users className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {participantCount}
        </span>
      </button>
      
      <button
        onClick={onToggleChat}
        className="p-4 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}