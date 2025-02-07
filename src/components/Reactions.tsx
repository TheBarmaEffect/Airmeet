import React, { useState, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}

interface ReactionsProps {
  onSendReaction: (emoji: string) => void;
}

const EMOJIS = ['👍', '👏', '❤️', '🎉', '🤔', '👀'];

export function Reactions({ onSendReaction }: ReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const addReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: crypto.randomUUID(),
      emoji,
      timestamp: Date.now(),
    };
    
    setReactions(prev => [...prev, reaction]);
    onSendReaction(emoji);
    setShowPicker(false);
  };

  // Clean up old reactions
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setReactions(prev =>
        prev.filter(reaction => now - reaction.timestamp < 3000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50"
        >
          <Smile className="w-6 h-6 text-gray-700" />
        </button>

        {showPicker && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => addReaction(emoji)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none">
        {reactions.map(reaction => (
          <div
            key={reaction.id}
            className="absolute bottom-32 right-16 text-4xl animate-float-up"
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
    </>
  );
}