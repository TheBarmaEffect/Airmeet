import React, { useState } from 'react';
import type { Message } from '../types/meeting';

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Chat({ messages, onSendMessage, isOpen, onClose }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-20 w-80 bg-white border-l shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] ${
              message.senderId === 'local' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div
              className={`rounded-lg p-3 ${
                message.senderId === 'local'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}