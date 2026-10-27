const express = require('express');
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { findSlot } = require('../config/slots');
const { generateBookingCode } = require('../utils/bookingCode');
const { isValidDate, isSlotPast } = require('../utils/time');
const { toPublicBooking } = require('../utils/serialize');

const router = express.Router();

const PHONE_RE = /^\+?[0-9\s-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/bookings
router.post('/', async (req, res) => {
  const body = req.body || {};
  const roomId = body.roomId;
  const date = body.date;
  const customerName = String(body.customerName || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const notes = String(body.notes || '').trim();
  const guests = Number(body.guests);

  if (!mongoose.isValidObjectId(roomId)) {
    return res.status(400).json({ message: 'Please choose a room' });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ message: 'Please choose a valid date' });
  }
  const slot = findSlot(body.slot);
  if (!slot) {
    return res.status(400).json({ message: 'Please choose a time slot' });
  }
  if (customerName.length < 2) {
    return res.status(400).json({ message: 'Please enter your name' });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ message: 'Please enter a valid phone number' });
  }
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (!Number.isInteger(guests) || guests < 1) {
    return res.status(400).json({ message: 'Number of guests must be at least 1' });
  }
  if (notes.length > 500) {
    return res.status(400).json({ message: 'Notes are too long (max 500 characters)' });
  }

  const room = await Room.findOne({ _id: roomId, isActive: true });
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (guests > room.capacity) {
    return res
      .status(400)
      .json({ message: `This room fits up to ${room.capacity} guests` });
  }
  if (isSlotPast(date, slot)) {
    return res.status(400).json({ message: 'That time slot has already passed' });
  }

  // Retry if a generated code happens to collide with an existing one
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const booking = await Booking.create({
        room: room._id,
        date,
        slot: slot.id,
        customerName,
        phone,
        email,
        guests,
        notes,
        bookingCode: generateBookingCode(),
        status: 'confirmed',
      });
      booking.room = room;
      const payload = await toPublicBooking(booking);
      return res.status(201).json({ booking: payload });
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern && err.keyPattern.bookingCode) continue; // code clash, retry
        // Same room + date + slot already taken (partial unique index)
        return res
          .status(409)
          .json({ message: 'Sorry, that slot was just booked. Please choose another.' });
      }
      throw err;
    }
  }
  return res.status(500).json({ message: 'Could not create booking, please try again' });
});

// GET /api/bookings/:code  (customer lookup with QR)
router.get('/:code', async (req, res) => {
  const code = String(req.params.code || '').toUpperCase().trim();
  const booking = await Booking.findOne({ bookingCode: code }).populate('room');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json({ booking: await toPublicBooking(booking) });
});

module.exports = router;
