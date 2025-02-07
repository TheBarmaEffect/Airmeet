import React from 'react';
import { Logo } from './Logo';
import { MeetingTimer } from './MeetingTimer';
import { Settings, Layout } from 'lucide-react';

interface MeetingHeaderProps {
  meetingName: string;
  onLayoutChange: () => void;
  onSettingsClick: () => void;
}

export function MeetingHeader({ meetingName, onLayoutChange, onSettingsClick }: MeetingHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Logo className="text-gray-800" />
        <div className="h-6 w-px bg-gray-300" />
        <h1 className="text-lg font-medium text-gray-800">{meetingName}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <MeetingTimer />
        <button
          onClick={onLayoutChange}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Change layout"
        >
          <Layout className="w-5 h-5" />
        </button>
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}