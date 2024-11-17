import express from 'express';
import { auth } from '../middleware/auth.js';
import Room from '../models/Room.js';

const router = express.Router();

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      owner: req.user._id,
      members: [req.user._id]
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('owner', 'username')
      .populate('members', 'username');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;