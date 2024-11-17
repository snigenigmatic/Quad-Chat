import { User } from './auth';

export interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  owner: string;
  members: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
