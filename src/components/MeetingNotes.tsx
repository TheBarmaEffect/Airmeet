import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface MeetingNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingNotes({ isOpen, onClose }: MeetingNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [copied, setCopied] = useState(false);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setNotes(prev => [
        ...prev,
        { id: crypto.randomUUID(), content: newNote, timestamp: Date.now() },
      ]);
      setNewNote('');
    }
  };

  const copyNotes = async () => {
    const text = notes
      .map(
        note =>
          `${new Date(note.timestamp).toLocaleTimeString()}: ${note.content}`
      )
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy notes:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-20 w-96 bg-white border-l shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">Meeting Notes</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyNotes}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Copy all notes"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">
              {new Date(note.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-gray-700">{note.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={addNote} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}