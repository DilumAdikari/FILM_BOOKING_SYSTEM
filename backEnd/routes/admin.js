const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const requireAdmin = require('../middleware/requireAdmin');
const { toAdminBooking } = require('../utils/serialize');
const { isValidDate } = require('../utils/time');

const router = express.Router();

const STATUSES = ['confirmed', 'checked_in', 'cancelled'];

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const username = String((req.body && req.body.username) || '').trim().toLowerCase();
  const password = String((req.body && req.body.password) || '');
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const admin = await Admin.findOne({ username });
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!ok) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ sub: String(admin._id), role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  res.json({ token, username: admin.username });
});

// Everything below requires a valid admin token
router.use(requireAdmin);

// GET /api/admin/bookings?date=YYYY-MM-DD&roomId=...   (both optional)
router.get('/bookings', async (req, res) => {
  const filter = {};
  if (req.query.date) {
    if (!isValidDate(req.query.date)) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    filter.date = req.query.date;
  }
  if (req.query.roomId) {
    if (!mongoose.isValidObjectId(req.query.roomId)) {
      return res.status(400).json({ message: 'Invalid room' });
    }
    filter.room = req.query.roomId;
  }

  const bookings = await Booking.find(filter)
    .populate('room')
    .sort({ date: 1, slot: 1, createdAt: 1 });
  res.json({ bookings: bookings.map(toAdminBooking) });
});

// GET /api/admin/bookings/code/:code  (used by the check-in box)
router.get('/bookings/code/:code', async (req, res) => {
  const code = String(req.params.code || '').toUpperCase().trim();
  const booking = await Booking.findOne({ bookingCode: code }).populate('room');
  if (!booking) return res.status(404).json({ message: 'No booking with that code' });
  res.json({ booking: toAdminBooking(booking) });
});

// PATCH /api/admin/bookings/:id   body: { status }
router.patch('/bookings/:id', async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  // Cancellation is final: the slot may already have been sold to someone else
  if (booking.status === 'cancelled' && status !== 'cancelled') {
    return res
      .status(400)
      .json({ message: 'Cancelled bookings cannot be reactivated' });
  }

  booking.status = status;
  try {
    await booking.save();
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'That slot is now taken by another booking' });
    }
    throw err;
  }
  await booking.populate('room');
  res.json({ booking: toAdminBooking(booking) });
});

// GET /api/admin/rooms  (includes inactive rooms)
router.get('/rooms', async (req, res) => {
  const rooms = await Room.find().sort({ name: 1 }).lean();
  res.json({
    rooms: rooms.map((r) => ({
      _id: r._id,
      name: r.name,
      description: r.description,
      capacity: r.capacity,
      isActive: r.isActive,
    })),
  });
});

// PATCH /api/admin/rooms/:id   body: { isActive?, capacity? }
router.patch('/rooms/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Room not found' });
  }
  const update = {};
  if (typeof req.body.isActive === 'boolean') update.isActive = req.body.isActive;
  if (req.body.capacity !== undefined) {
    const cap = Number(req.body.capacity);
    if (!Number.isInteger(cap) || cap < 1) {
      return res.status(400).json({ message: 'Capacity must be a whole number, at least 1' });
    }
    update.capacity = cap;
  }
  const room = await Room.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json({
    room: {
      _id: room._id,
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      isActive: room.isActive,
    },
  });
});

module.exports = router;
