const QRCode = require('qrcode');
const { findSlot } = require('../config/slots');

// QR image (data URL) that encodes the booking code.
// Staff can scan it or type the code into the admin "check booking" box.
async function makeQrDataUrl(bookingCode) {
  return QRCode.toDataURL(bookingCode, { width: 320, margin: 1 });
}

// Shape returned to customers
async function toPublicBooking(booking) {
  const slot = findSlot(booking.slot);
  return {
    bookingCode: booking.bookingCode,
    status: booking.status,
    date: booking.date,
    slot: booking.slot,
    slotLabel: slot ? `${slot.start} – ${slot.end}` : booking.slot,
    room: booking.room
      ? { id: booking.room._id, name: booking.room.name }
      : null,
    customerName: booking.customerName,
    guests: booking.guests,
    notes: booking.notes,
    qrDataUrl: await makeQrDataUrl(booking.bookingCode),
  };
}

// Fuller shape for the admin dashboard (no QR, includes contact info)
function toAdminBooking(booking) {
  const slot = findSlot(booking.slot);
  return {
    id: booking._id,
    bookingCode: booking.bookingCode,
    status: booking.status,
    date: booking.date,
    slot: booking.slot,
    slotLabel: slot ? `${slot.start} – ${slot.end}` : booking.slot,
    room: booking.room
      ? { id: booking.room._id, name: booking.room.name }
      : null,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    guests: booking.guests,
    notes: booking.notes,
    createdAt: booking.createdAt,
  };
}

module.exports = { toPublicBooking, toAdminBooking };
