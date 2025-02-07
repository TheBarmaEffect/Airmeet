import React, { useState } from 'react';
import { Image } from 'lucide-react';

const backgrounds = [
  { id: 'none', name: 'None', url: null },
  {
    id: 'office',
    name: 'Modern Office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
  },
  {
    id: 'nature',
    name: 'Nature',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  },
  {
    id: 'blur',
    name: 'Blur',
    url: 'blur',
  },
];

interface VirtualBackgroundProps {
  onSelectBackground: (background: string | null) => void;
  onClose: () => void;
}

export function VirtualBackground({ onSelectBackground, onClose }: VirtualBackgroundProps) {
  const [selectedId, setSelectedId] = useState('none');

  const handleSelect = (background: typeof backgrounds[0]) => {
    setSelectedId(background.id);
    onSelectBackground(background.url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Image className="w-5 h-5" />
              Virtual Background
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {backgrounds.map((background) => (
              <button
                key={background.id}
                onClick={() => handleSelect(background)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedId === background.id
                    ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {background.url ? (
                  background.url === 'blur' ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 blur-xl" />
                  ) : (
                    <img
                      src={background.url}
                      alt={background.name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
                <div className="absolute bottom-2 left-2 right-2 text-sm font-medium">
                  {background.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}