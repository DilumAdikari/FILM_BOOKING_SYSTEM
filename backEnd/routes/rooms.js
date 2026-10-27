const express = require('express');
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { SLOTS } = require('../config/slots');
const { isValidDate, isSlotPast } = require('../utils/time');

const router = express.Router();

// GET /api/slots
router.get('/slots', (req, res) => {
  res.json({ slots: SLOTS });
});

// GET /api/rooms  (active rooms only)
router.get('/rooms', async (req, res) => {
  const rooms = await Room.find({ isActive: true }).sort({ name: 1 }).lean();
  res.json({ rooms: rooms.map(formatRoom) });
});

// GET /api/rooms/:id
router.get('/rooms/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Room not found' });
  }
  const room = await Room.findOne({ _id: req.params.id, isActive: true }).lean();
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json({ room: formatRoom(room) });
});

// GET /api/rooms/:id/availability?date=YYYY-MM-DD
router.get('/rooms/:id/availability', async (req, res) => {
  const { date } = req.query;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Room not found' });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) is required' });
  }

  const room = await Room.findOne({ _id: req.params.id, isActive: true }).lean();
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const taken = await Booking.find({
    room: room._id,
    date,
    status: { $in: ['confirmed', 'checked_in'] },
  })
    .select('slot')
    .lean();
  const takenSet = new Set(taken.map((b) => b.slot));

  const slots = SLOTS.map((slot) => ({
    ...slot,
    available: !takenSet.has(slot.id) && !isSlotPast(date, slot),
  }));

  res.json({ date, slots });
});

function formatRoom(room) {
  return {
    _id: room._id,
    name: room.name,
    description: room.description,
    capacity: room.capacity,
  };
}

module.exports = router;
