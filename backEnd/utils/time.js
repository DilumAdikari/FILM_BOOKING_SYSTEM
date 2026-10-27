// All booking dates are interpreted in the cinema's local timezone.
const TIMEZONE = 'Asia/Colombo';

// Today as YYYY-MM-DD in the cinema timezone
function todayLocal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE });
}

// Current time as HH:MM in the cinema timezone
function nowHHMM() {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Strict YYYY-MM-DD check (rejects things like 2026-02-30)
function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// True if the slot is in the past (or already started) for the given date
function isSlotPast(date, slot) {
  const today = todayLocal();
  if (date < today) return true;
  if (date === today) return slot.start <= nowHHMM();
  return false;
}

module.exports = { TIMEZONE, todayLocal, nowHHMM, isValidDate, isSlotPast };
