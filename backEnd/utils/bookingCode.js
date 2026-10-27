const crypto = require('crypto');

// No 0/O/1/I to avoid confusion when someone reads the code out loud
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Format: XXXX-XXXX
function generateBookingCode() {
  let raw = '';
  for (let i = 0; i < 8; i += 1) {
    raw += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

module.exports = { generateBookingCode };
