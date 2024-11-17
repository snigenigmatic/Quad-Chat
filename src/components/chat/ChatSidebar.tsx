import React, { useState } from 'react';
import { MessageSquare, LogOut, Users } from 'lucide-react';
import { User, Room } from '../../types/index';
import UserList from './UserList';
import RoomList from './RoomList';
import CreateRoomModal from './CreateRoomModal';

interface ChatSidebarProps {
  currentUser: User | null;
  onlineUsers: User[];
  selectedUser: User | null;
  selectedRoom: Room | null;
  rooms: Room[];
  onLogout: () => void;
  onCreateRoom: (roomData: { name: string; description: string; isPrivate: boolean }) => Promise<void>;
  onJoinRoom: (roomId: string) => Promise<void>;
  onSelectUser: (user: User | null) => void;
  onSelectRoom: (roomId: string) => void;
}

export default function ChatSidebar({
  currentUser,
  onlineUsers,
  selectedUser,
  selectedRoom,
  rooms,
  onLogout,
  onCreateRoom,
  onJoinRoom,
  onSelectUser,
  onSelectRoom
}: ChatSidebarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useState<'users' | 'rooms'>('users');

  const handleViewChange = (newView: 'users' | 'rooms') => {
    setView(newView);
    if (newView === 'users') {
      onSelectUser(null);
      onSelectRoom('general');
    } else {
      onSelectUser(null);
    }
  };

  const handleCreateRoom = (data: { name: string; description: string; isPrivate: boolean }) => {
    onCreateRoom(data).then(() => {
      setIsCreateModalOpen(false);
      setView('rooms');
    }).catch(error => {
      console.error('Error creating room:', error);
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold">QuadChat</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleViewChange('users')}
          className={`flex-1 p-3 text-sm font-medium ${
            view === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-5 w-5 mx-auto mb-1" />
          Users
        </button>
        <button
          onClick={() => handleViewChange('rooms')}
          className={`flex-1 p-3 text-sm font-medium ${
            view === 'rooms' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="h-5 w-5 mx-auto mb-1" />
          Rooms
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'users' ? (
          <UserList
            currentUser={currentUser}
            users={onlineUsers}
            selectedUser={selectedUser}
            onSelectUser={onSelectUser}
          />
        ) : (
          <>
            <div className="p-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Room
              </button>
            </div>
            <RoomList
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelectRoom={onSelectRoom}
              onJoinRoom={onJoinRoom}
            />
          </>
        )}
      </div>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}