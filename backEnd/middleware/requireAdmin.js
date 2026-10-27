const jwt = require('jsonwebtoken');

// Expects header: Authorization: Bearer <token>
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Admin login required' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error('not admin');
    req.admin = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired, please log in again' });
  }
}

module.exports = requireAdmin;
