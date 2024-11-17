import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Message, User, Room } from '../types';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Memoized handlers
  const handleDirectMessage = useCallback((message: Message) => {
    console.log('Received direct message:', message);
    if (
      selectedUser &&
      ((message.sender.id === selectedUser.id && message.recipient?.id === user?.id?.toString()) ||
        (message.sender.id === user?.id?.toString() && message.recipient?.id === selectedUser.id))
    ) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.pending);
        return [...filtered, message];
      });
    }
  }, [selectedUser, user?.id]);

  const handleRoomMessage = useCallback((message: Message) => {
    if (selectedRoom && message.room === selectedRoom._id) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.pending);
        return [...filtered, message];
      });
    }
  }, [selectedRoom]);

  // Socket connection setup with error handling
  const setupSocket = useCallback(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socketEventHandlers = {
      connect: () => console.log('Connected to socket server'),
      error: (error: any) => {
        console.error('Socket error:', error);
        if (error.message === 'Authentication error') {
          logout();
          navigate('/login');
        }
      },
      users: (users: User[]) => {
        setOnlineUsers(users.filter(u => u?.id && u.id !== user?.id?.toString()));
      },
      disconnect: () => setOnlineUsers([]),
      reconnect: () => console.log('Reconnected to socket server')
    };

    Object.entries(socketEventHandlers).forEach(([event, handler]) => {
      newSocket.on(event, handler);
    });

    return newSocket;
  }, [user?.id, logout, navigate]);

  // Message sending with optimistic updates
  const handleSendMessage = useCallback((content: string) => {
    if (!socket || !content.trim()) return;

    const tempMessage = {
      content,
      sender: { id: user?.id?.toString(), username: user?.username },
      timestamp: new Date(),
      pending: true,
      id: `temp-${Date.now()}`,
      type: selectedUser ? 'direct' : 'room'
    };

    if (selectedUser) {
      tempMessage.recipient = { id: selectedUser.id, username: selectedUser.username };
      socket.emit('direct-message', { content, recipientId: selectedUser.id });
    } else if (selectedRoom) {
      tempMessage.room = selectedRoom._id;
      socket.emit('room-message', { content, roomId: selectedRoom._id });
    }

    setMessages(prev => [...prev, tempMessage]);
  }, [socket, selectedUser, selectedRoom, user]);

  // Room management with error boundaries
  const loadRooms = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(response.data);

      const generalRoom = response.data.find((r: Room) => r.name === 'General');
      if (generalRoom) handleSelectRoom(generalRoom._id);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  }, []);

  // Main socket effect
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const newSocket = setupSocket();
    setSocket(newSocket);
    loadRooms();

    return () => {
      newSocket.close();
    };
  }, [user, setupSocket, loadRooms, navigate]);

  // Message handling effect
  useEffect(() => {
    if (!socket) return;

    const messageHandlers = {
      'direct-message': handleDirectMessage,
      'direct-messages': setMessages,
      'rooms': setRooms,
      'room-message': handleRoomMessage,
      'room-messages': (messages: Message[]) => setMessages(messages)
    };

    Object.entries(messageHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(messageHandlers).forEach(event => {
        socket.off(event);
      });
    };
  }, [socket, handleDirectMessage, handleRoomMessage]);

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    logout();
    navigate('/login');
  };

  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
    setSelectedRoom(null);
    setMessages([]);
    if (socket && user) {
      socket.emit('load-direct-messages', user.id);
    }
  };

  const handleSelectRoom = (roomId: string) => {
    const room = rooms.find((r) => r._id === roomId);
    if (!room) return;

    setSelectedUser(null);
    setSelectedRoom(room);
    setMessages([]);

    if (socket) {
      socket.emit('join-room', roomId);
      socket.emit('load-room-messages', roomId);
    }
  };

  const handleCreateRoom = async (roomData: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => {
    try {
      await axios.post('http://localhost:3001/api/rooms', roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await loadRooms();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await axios.post(
        `http://localhost:3001/api/rooms/${roomId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const room = rooms.find((r) => r._id === roomId);
      if (room) {
        setSelectedUser(null);
        setSelectedRoom(room);

        if (socket) {
          socket.emit('join-room', roomId);
          socket.emit('load-room-messages', roomId);
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        currentUser={user}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        selectedRoom={selectedRoom}
        rooms={rooms}
        onSelectUser={handleSelectUser}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col bg-white rounded-l-2xl shadow-xl">
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            currentUser={user}
            selectedUser={selectedUser}
            selectedRoom={selectedRoom}
          />
        </div>
        <div className="p-4 border-t">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}