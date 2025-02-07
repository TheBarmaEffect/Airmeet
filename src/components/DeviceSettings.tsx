import React, { useState, useEffect } from 'react';
import { Settings, Video, Mic, Volume2 } from 'lucide-react';

interface Device {
  deviceId: string;
  label: string;
}

interface DeviceSettingsProps {
  onClose: () => void;
  onDeviceChange: (type: string, deviceId: string) => void;
}

export function DeviceSettings({ onClose, onDeviceChange }: DeviceSettingsProps) {
  const [videoDevices, setVideoDevices] = useState<Device[]>([]);
  const [audioInputDevices, setAudioInputDevices] = useState<Device[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<Device[]>([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        setVideoDevices(
          devices.filter(device => device.kind === 'videoinput')
            .map(device => ({
              deviceId: device.deviceId,
              label: device.label || `Camera ${device.deviceId.slice(0, 5)}`
            }))
        );
        
        setAudioInputDevices(
          devices.filter(device => device.kind === 'audioinput')
            .map(device => ({
              deviceId: device.deviceId,
              label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`
            }))
        );
        
        setAudioOutputDevices(
          devices.filter(device => device.kind === 'audiooutput')
            .map(device => ({
              deviceId: device.deviceId,
              label: device.label || `Speaker ${device.deviceId.slice(0, 5)}`
            }))
        );
      } catch (error) {
        console.error('Error loading devices:', error);
      }
    };

    loadDevices();
  }, []);

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[480px] max-w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Device Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Video className="w-4 h-4" />
                Camera
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                onChange={e => onDeviceChange('video', e.target.value)}
              >
                {videoDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mic className="w-4 h-4" />
                Microphone
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                onChange={e => onDeviceChange('audioInput', e.target.value)}
              >
                {audioInputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Volume2 className="w-4 h-4" />
                Speaker
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                onChange={e => onDeviceChange('audioOutput', e.target.value)}
              >
                {audioOutputDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}