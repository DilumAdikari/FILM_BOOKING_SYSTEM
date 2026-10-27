# Film Room Booking System

MERN app: customers book one of 7 private film rooms, get a booking code + QR code,
and staff manage bookings from an admin panel.

## Structure

- `backEnd/` – Express + MongoDB (Mongoose) API, JWT admin auth
- `frontEnd/` – React + Vite + Tailwind + React Router (mobile-first UI)

## Setup

### 1. MongoDB
Run MongoDB locally, or use a MongoDB Atlas connection string.

### 2. Backend

```bash
cd backEnd
npm install
cp .env.example .env     # then edit MONGO_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
npm run seed             # creates Room 1–7 and the admin account (run once)
npm run dev              # API on http://localhost:5000
```

### 3. Frontend

```bash
cd frontEnd
npm install
npm run dev              # http://localhost:5173 (proxies /api to the backend)
```

## Pages

| Path | Who | What |
| --- | --- | --- |
| `/` | Customer | List of rooms |
| `/rooms/:id` | Customer | Pick date + free time slot, enter details, confirm |
| `/booking/:code` | Customer | Booking details + QR code (print-friendly) |
| `/check` | Customer | Find a booking by its code |
| `/admin/login` | Staff | Admin login |
| `/admin` | Staff | Bookings for a date (check in / cancel), look up by code, enable/disable rooms |

## Rules built in

- Time slots are fixed (see `backEnd/config/slots.js`); each room can hold one
  active booking per slot. The database enforces this with a unique index, so two
  people can't book the same slot at the same time.
- Past dates and slots that have already started cannot be booked.
- Guests cannot exceed the room capacity (default 6, editable from the admin Rooms tab).
- Booking codes look like `K7P9-2XMQ`; the QR code encodes the same code.
- No payment step yet.

## API summary

Public: `GET /api/slots`, `GET /api/rooms`, `GET /api/rooms/:id`,
`GET /api/rooms/:id/availability?date=YYYY-MM-DD`, `POST /api/bookings`,
`GET /api/bookings/:code`

Admin (Bearer token): `POST /api/admin/login`, `GET /api/admin/bookings`,
`GET /api/admin/bookings/code/:code`, `PATCH /api/admin/bookings/:id`,
`GET /api/admin/rooms`, `PATCH /api/admin/rooms/:id`
