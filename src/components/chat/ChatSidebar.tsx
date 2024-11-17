import React, { useState } from 'react';
import { MessageSquare, LogOut, Users } from 'lucide-react';
import { User, Room } from '../../types/index';
import UserList from './UserList';
import RoomList from './RoomList';
import CreateRoomModal from './CreateRoomModal';
import ThemeToggle from '../ThemeToggle';

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
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">QuadChat</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => handleViewChange('users')}
          className={`flex-1 p-3 text-sm font-medium ${
            view === 'users' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="h-5 w-5 mx-auto mb-1" />
          Users
        </button>
        <button
          onClick={() => handleViewChange('rooms')}
          className={`flex-1 p-3 text-sm font-medium ${
            view === 'rooms' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <MessageSquare className="h-5 w-5 mx-auto mb-1" />
          Rooms
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
        {view === 'users' ? (
          <UserList
            currentUser={currentUser}
            users={onlineUsers}
            selectedUser={selectedUser}
            onSelectUser={onSelectUser}
          />
        ) : (
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={onSelectRoom}
            onCreateRoom={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      {isCreateModalOpen && (
        <CreateRoomModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  );
}