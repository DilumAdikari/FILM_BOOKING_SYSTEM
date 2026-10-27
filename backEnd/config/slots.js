// Fixed daily time slots. This is the single source of truth for the
// backend; the frontend gets the list from GET /api/slots.
const SLOTS = [
  { id: '09:00-11:00', start: '09:00', end: '11:00' },
  { id: '11:30-13:30', start: '11:30', end: '13:30' },
  { id: '14:00-16:00', start: '14:00', end: '16:00' },
  { id: '16:30-18:30', start: '16:30', end: '18:30' },
  { id: '19:00-21:00', start: '19:00', end: '21:00' },
  { id: '21:30-23:30', start: '21:30', end: '23:30' },
];

function findSlot(id) {
  return SLOTS.find((s) => s.id === id) || null;
}

module.exports = { SLOTS, findSlot };
