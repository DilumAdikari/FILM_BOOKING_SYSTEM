// Simple in-memory login rate limiter.
// After MAX_FAILURES failed logins from the same IP within WINDOW_MS,
// further attempts are blocked until the window expires.
// Note: state is kept in memory, so it resets when the server restarts.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILURES = 5;

const failures = new Map(); // ip -> { count, resetAt }

function getEntry(ip) {
  const entry = failures.get(ip);
  if (!entry) return null;
  if (entry.resetAt <= Date.now()) {
    failures.delete(ip);
    return null;
  }
  return entry;
}

// Blocks the request if this IP has too many recent failures
function loginRateLimit(req, res, next) {
  const entry = getEntry(req.ip);
  if (entry && entry.count >= MAX_FAILURES) {
    const minutes = Math.ceil((entry.resetAt - Date.now()) / 60000);
    return res.status(429).json({
      message: `Too many failed login attempts. Try again in ${minutes} minute(s).`,
    });
  }
  return next();
}

function recordLoginFailure(req) {
  const entry = getEntry(req.ip);
  if (entry) {
    entry.count += 1;
  } else {
    failures.set(req.ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  }
}

function clearLoginFailures(req) {
  failures.delete(req.ip);
}

module.exports = { loginRateLimit, recordLoginFailure, clearLoginFailures };
