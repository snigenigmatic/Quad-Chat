export interface User {
  _id?: string;
  id: string;
  username: string;
  avatar?: string;
  socketId?: string;
}

export interface Room {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  owner: string;
  members: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  recipient?: User;
  room?: string;
  type?: 'direct' | 'room';
  timestamp: string;
  createdAt?: Date;
}
