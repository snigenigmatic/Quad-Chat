import React from 'react';
import { MessageSquare, LogOut } from 'lucide-react';
import { User } from '../../types/auth';
import UserList from './UserList';

interface SidebarProps {
  currentUser: User | null;
  onlineUsers: User[];
  onLogout: () => void;
}

export default function Sidebar({ currentUser, onlineUsers, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
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
      <div className="flex-1 overflow-y-auto">
        <UserList currentUser={currentUser} users={onlineUsers} />
      </div>
    </div>
  );
}