import React from 'react';
import { User } from '../../types/auth';

interface UserListProps {
  currentUser: User | null;
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export default function UserList({ currentUser, users, selectedUser, onSelectUser }: UserListProps) {
  return (
    <div className="p-4 space-y-2">
      {users.map((user) => {
        const isCurrentUser = user.id === currentUser?.id;
        const isSelected = user.id === selectedUser?.id;
        
        return (
          <div
            key={user.id}
            onClick={() => !isCurrentUser && onSelectUser(isSelected ? null : user)}
            className={`
              p-3 rounded-lg flex items-center justify-between
              ${isCurrentUser 
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
              }
              ${isSelected 
                ? 'bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700' 
                : ''
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-200">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.username}
                  {isCurrentUser && <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(You)</span>}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
            {isSelected && (
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Selected
              </div>
            )}
          </div>
        );
      })}
      {users.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No other users online
        </div>
      )}
    </div>
  );
}