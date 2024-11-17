import React from 'react';
import { format } from 'date-fns';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        <img
          src={message.sender.avatar}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full"
        />
        <div className={`mx-2 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <span className="text-sm text-gray-600 mb-1">{message.sender.username}</span>
            <div
              className={`rounded-lg px-4 py-2 ${
                isOwnMessage
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;