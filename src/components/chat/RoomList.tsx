import React from 'react';
import { Room } from '../../types/room';
import { Lock, Users } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => Promise<void>;
}

export default function RoomList({ rooms, selectedRoom, onSelectRoom, onJoinRoom }: RoomListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No rooms available
        </div>
      ) : (
        <div className="space-y-1 p-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                selectedRoom?.id === room.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {room.isPrivate && <Lock className="h-4 w-4 text-gray-400" />}
                  <span className="font-medium">{room.name}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{room.members?.length || 0}</span>
                </div>
              </div>
              {room.description && (
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {room.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}