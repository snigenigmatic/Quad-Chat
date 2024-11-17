export interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  recipient?: {
    _id: string;
    username: string;
  };
  content: string;
  room?: string;
  type: 'room' | 'direct';
  timestamp: string;
}