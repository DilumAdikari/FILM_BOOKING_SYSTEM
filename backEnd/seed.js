// Run once after setting up .env:  npm run seed
// - Creates the 7 film rooms (skips any that already exist)
// - Creates the admin account from ADMIN_USERNAME / ADMIN_PASSWORD
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Room = require('./models/Room');
const Admin = require('./models/Admin');

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
  await mongoose.connect(process.env.MONGO_URI);

  for (let i = 1; i <= 7; i += 1) {
    const name = `Room ${i}`;
    const exists = await Room.exists({ name });
    if (!exists) {
      await Room.create({ name, capacity: 6, description: '' });
      console.log(`Created ${name}`);
    }
  }

  const username = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!username || password.length < 8) {
    throw new Error('Set ADMIN_USERNAME and an ADMIN_PASSWORD of at least 8 characters in .env');
  }
  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ username, passwordHash });
    console.log(`Created admin "${username}"`);
  } else {
    console.log(`Admin "${username}" already exists, leaving it unchanged`);
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect();
  process.exit(1);
});
