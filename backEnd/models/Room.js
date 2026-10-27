const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '', trim: true },
    capacity: { type: Number, required: true, min: 1, default: 6 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
