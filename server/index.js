import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with the correct path
dotenv.config({ path: join(__dirname, '.env') });

// Debug logging
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Environment variables loaded from:', join(__dirname, '.env'));

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import roomRoutes from './routes/rooms.js';
import Message from './models/Message.js';
import User from './models/User.js';
import Room from './models/Room.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Initialize general room
let generalRoom;
async function initializeGeneralRoom() {
  try {
    generalRoom = await Room.findOne({ name: 'General' });
    if (!generalRoom) {
      generalRoom = new Room({
        name: 'General',
        description: 'General chat room for all users',
        isPrivate: false,
        owner: null // System-owned room
      });
      await generalRoom.save();
    }
    console.log('General room initialized:', generalRoom._id);
    return generalRoom;
  } catch (error) {
    console.error('Error initializing general room:', error);
    throw error;
  }
}

// Connect to MongoDB and initialize
connectDB().then(async () => {
  try {
    await initializeGeneralRoom();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('Authentication error');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.user.username);
  
  // Add user to connected users
  connectedUsers.set(socket.user._id.toString(), {
    id: socket.user._id.toString(),
    username: socket.user.username,
    socketId: socket.id
  });

  // Broadcast updated user list to all clients
  io.emit('users', Array.from(connectedUsers.values()));

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
    connectedUsers.delete(socket.user._id.toString());
    // Broadcast updated user list after disconnection
    io.emit('users', Array.from(connectedUsers.values()));
  });

  // Join general room
  socket.join(generalRoom._id.toString());
  
  // Load direct messages between users
  socket.on('load-direct-messages', async (otherUserId) => {
    try {
      const messages = await Message.find({
        type: 'direct',
        $or: [
          { sender: socket.user._id, recipient: otherUserId },
          { sender: otherUserId, recipient: socket.user._id }
        ]
      })
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('sender', 'username')
        .populate('recipient', 'username')
        .sort({ timestamp: 1 });
      
      socket.emit('direct-messages', messages);
    } catch (error) {
      console.error('Error loading direct messages:', error);
      socket.emit('error', { message: 'Failed to load direct messages' });
    }
  });

  // Load room messages
  socket.on('load-room-messages', async (roomId) => {
    try {
      let targetRoomId;
      if (roomId === 'general') {
        if (!generalRoom) {
          generalRoom = await Room.findOne({ name: 'General' });
          if (!generalRoom) {
            throw new Error('General room not found');
          }
        }
        targetRoomId = generalRoom._id;
      } else {
        targetRoomId = roomId;
      }

      const messages = await Message.find({
        room: targetRoomId,
        type: 'room'
      })
      .populate('sender', 'username')
      .sort({ timestamp: 1 })
      .limit(50);

      socket.emit('room-messages', messages);
    } catch (error) {
      console.error('Error loading room messages:', error);
      socket.emit('error', { message: 'Failed to load messages' });
    }
  });

  // Handle joining rooms
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    socket.emit('room-messages', messages);
  });

  // Handle room messages
  socket.on('room-message', async (data) => {
    try {
      let roomId;
      if (data.roomId === 'general') {
        if (!generalRoom) {
          generalRoom = await Room.findOne({ name: 'General' });
          if (!generalRoom) {
            throw new Error('General room not found');
          }
        }
        roomId = generalRoom._id;
      } else {
        roomId = data.roomId;
      }

      const message = new Message({
        content: data.content,
        sender: socket.user._id,
        room: roomId,
        type: 'room',
        timestamp: new Date()
      });

      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username');
      
      io.to(roomId.toString()).emit('room-message', populatedMessage);
    } catch (error) {
      console.error('Error saving room message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle direct messages
  socket.on('direct-message', async (data) => {
    try {
      const message = new Message({
        content: data.content,
        sender: socket.user._id,
        recipient: data.recipientId,
        type: 'direct',
        timestamp: new Date()
      });
      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username')
        .populate('recipient', 'username');
      
      // Send to both sender and recipient
      const recipientSocket = Array.from(connectedUsers.values())
        .find(user => user.id === data.recipientId)?.socketId;
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('direct-message', populatedMessage);
      }
      socket.emit('direct-message', populatedMessage);
    } catch (error) {
      console.error('Error saving direct message:', error);
      socket.emit('error', { message: 'Failed to send direct message' });
    }
  });

  // Handle file uploads
  socket.on('file-upload', async (data) => {
    try {
      const message = new Message({
        content: 'Shared a file',
        sender: socket.user._id,
        type: data.type,
        room: data.type === 'room' ? data.roomId : undefined,
        recipient: data.type === 'direct' ? data.recipientId : undefined,
        file: {
          filename: data.file.filename,
          originalName: data.file.originalName,
          mimetype: data.file.mimetype,
          size: data.file.size
        }
      });
      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username');
      
      if (data.type === 'room') {
        io.to(data.roomId).emit('message', populatedMessage);
      } else {
        const recipientSocket = Array.from(connectedUsers.values())
          .find(user => user.id === data.recipientId)?.socketId;
        if (recipientSocket) {
          io.to(recipientSocket).emit('direct-message', populatedMessage);
        }
        socket.emit('direct-message', populatedMessage);
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3001;