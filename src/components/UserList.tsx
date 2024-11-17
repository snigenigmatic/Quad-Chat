import React from 'react';
import { User as UserType } from '../types';

interface UserListProps {
  users: UserType[];
  currentUser: UserType;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">Online Users</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              user.id === currentUser.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user.username}
                {user.id === currentUser.id && (
                  <span className="text-xs text-gray-500 ml-2">(You)</span>
                )}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;