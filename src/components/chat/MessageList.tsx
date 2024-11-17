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
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {messages.map((msg, index) => (
        <div
          key={msg._id || index}
          className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
        >
          <div className="max-w-[70%]">
            <div
              className={`rounded-lg px-4 py-2 ${
                isOwnMessage(msg)
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">
                  {isOwnMessage(msg) ? 'You' : msg.sender.username}
                </p>
                <p className={`text-xs ${isOwnMessage(msg) ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {isValid(new Date(msg.timestamp)) ? format(new Date(msg.timestamp), 'HH:mm') : 'Just now'}
                </p>
              </div>
              <p className="break-words">{msg.content}</p>
            </div>
            {msg.type === 'direct' && (
              <p className={`text-xs mt-1 ${isOwnMessage(msg) ? 'text-right' : 'text-left'} text-gray-500`}>
                {isOwnMessage(msg) ? `Sent to ${msg.recipient?.username}` : 'Direct message'}
              </p>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}