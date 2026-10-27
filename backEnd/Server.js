require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env first.');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Add it to your .env file.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

start().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
