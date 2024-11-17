import React from 'react';
import { Message } from '../../types/message';
import { User } from '../../types/auth';
import { format, isValid } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // If we're within 100px of the bottom, enable auto-scroll
    setShouldAutoScroll(distanceFromBottom < 100);
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Only scroll to bottom for new messages if shouldAutoScroll is true
  React.useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  const isOwnMessage = (message: Message) => {
    return message.sender._id === currentUser?.id?.toString() || 
           message.sender.id === currentUser?.id?.toString();
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-gray-50 dark:bg-gray-900"
    >
      {messages.map((msg, index) => (
        <div
          key={msg._id || `temp-${index}`}
          className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] break-words rounded-lg px-4 py-2 ${
              isOwnMessage(msg)
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              {!isOwnMessage(msg) && (
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {msg.sender.username}
                </span>
              )}
              {isValid(new Date(msg.timestamp)) && (
                <span className="text-xs text-gray-100 dark:text-gray-300">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
              )}
            </div>
            <p className={`mt-1 ${isOwnMessage(msg) ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {msg.content}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}