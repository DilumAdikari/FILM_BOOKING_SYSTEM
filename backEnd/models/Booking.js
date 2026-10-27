const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    slot: { type: String, required: true }, // e.g. "14:00-16:00"
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    guests: { type: Number, required: true, min: 1 },
    notes: { type: String, default: '', trim: true },
    bookingCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['confirmed', 'checked_in', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// A room can only have one active booking per date+slot.
// Partial index: cancelled bookings don't block the slot.
bookingSchema.index(
  { room: 1, date: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['confirmed', 'checked_in'] } },
  }
);
bookingSchema.index({ date: 1, slot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
