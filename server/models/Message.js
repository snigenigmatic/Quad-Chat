import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['room', 'direct'],
    required: true
  },
  file: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);