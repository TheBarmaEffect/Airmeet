import React from 'react';
import type { Participant, LayoutMode } from '../types/meeting';

interface VideoGridProps {
  participants: Participant[];
  layoutMode: LayoutMode;
  activeSpeaker?: Participant;
}

export function VideoGrid({ participants, layoutMode, activeSpeaker }: VideoGridProps) {
  const gridClassName = React.useMemo(() => {
    if (layoutMode === 'spotlight') {
      return 'grid-cols-1';
    }
    
    if (layoutMode === 'sidebar') {
      return 'grid-cols-[1fr_300px]';
    }
    
    const count = participants.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  }, [participants.length, layoutMode]);

  if (layoutMode === 'spotlight' && activeSpeaker) {
    return (
      <div className="grid grid-rows-[1fr_120px] gap-4 p-4 h-full">
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <VideoParticipant participant={activeSpeaker} />
        </div>
        <div className="grid grid-flow-col auto-cols-[200px] gap-4 overflow-x-auto">
          {participants
            .filter(p => p.id !== activeSpeaker.id)
            .map(participant => (
              <div
                key={participant.id}
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
              >
                <VideoParticipant participant={participant} />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClassName} gap-4 p-4 h-full`}>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
        >
          <VideoParticipant participant={participant} />
        </div>
      ))}
    </div>
  );
}

function VideoParticipant({ participant }: { participant: Participant }) {
  return (
    <>
      {participant.stream && (
        <video
          ref={(ref) => {
            if (ref) {
              ref.srcObject = participant.stream!;
              ref.muted = participant.id === 'local';
            }
          }}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
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
    </>
  );
}