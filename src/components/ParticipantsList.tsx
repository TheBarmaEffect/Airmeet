import React from 'react';
import { Users, Mic, MicOff, Hand } from 'lucide-react';
import type { Participant } from '../types/meeting';

interface ParticipantsListProps {
  participants: Participant[];
  onToggleParticipantAudio?: (participantId: string) => void;
  raisedHands: Set<string>;
}

export function ParticipantsList({
  participants,
  onToggleParticipantAudio,
  raisedHands,
}: ParticipantsListProps) {
  return (
    <div className="w-80 bg-white border-l shadow-lg flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">Participants ({participants.length})</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 border-b"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {participant.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {participant.name || 'User'} {participant.id === 'local' && '(You)'}
                </p>
                {raisedHands.has(participant.id) && (
                  <div className="flex items-center text-yellow-600 text-sm">
                    <Hand className="w-4 h-4 mr-1" />
                    <span>Hand raised</span>
                  </div>
                )}
              </div>
            </div>
            
            {onToggleParticipantAudio && (
              <button
                onClick={() => onToggleParticipantAudio(participant.id)}
                className="text-gray-600 hover:text-gray-900"
              >
                {participant.audioEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}