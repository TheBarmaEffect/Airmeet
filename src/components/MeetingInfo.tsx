import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface MeetingInfoProps {
  meetingId: string;
}

export function MeetingInfo({ meetingId }: MeetingInfoProps) {
  const [copied, setCopied] = useState(false);
  const meetingLink = `${window.location.origin}/meeting/${meetingId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => {
          const infoDialog = document.getElementById('meeting-info-dialog');
          if (infoDialog instanceof HTMLDialogElement) {
            infoDialog.showModal();
          }
        }}
        className="bg-white/90 backdrop-blur-sm hover:bg-white/95 text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share meeting</span>
      </button>

      <dialog
        id="meeting-info-dialog"
        className="rounded-lg shadow-xl p-0 backdrop:bg-black/50"
      >
        <div className="w-[400px] max-w-full">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Meeting Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={meetingId}
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard()}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={meetingLink}
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard()}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t px-6 py-4 flex justify-end">
            <button
              onClick={() => {
                const infoDialog = document.getElementById('meeting-info-dialog');
                if (infoDialog instanceof HTMLDialogElement) {
                  infoDialog.close();
                }
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}