export interface Participant {
  id: string;
  name?: string;
  stream?: MediaStream;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenShare?: MediaStream;
  isActiveSpeaker?: boolean;
  backgroundBlur?: boolean;
  virtualBackground?: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export type LayoutMode = 'grid' | 'spotlight' | 'sidebar';

export interface MeetingInfo {
  id: string;
  name: string;
  createdAt: number;
}