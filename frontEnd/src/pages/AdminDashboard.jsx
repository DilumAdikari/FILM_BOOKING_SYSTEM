import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ADMIN_TOKEN_KEY } from '../lib/api.js'
import { todayLocal, formatDate } from '../lib/date.js'

const STATUS_STYLE = {
  confirmed: 'bg-emerald-900 text-emerald-300',
  checked_in: 'bg-sky-900 text-sky-300',
  cancelled: 'bg-red-950 text-red-300',
}
const STATUS_TEXT = {
  confirmed: 'Confirmed',
  checked_in: 'Checked in',
  cancelled: 'Cancelled',
}

const inputClass =
  'min-h-11 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-base text-neutral-100 focus:border-amber-400 focus:outline-none'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('bookings')
  const [date, setDate] = useState(todayLocal())
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeResult, setCodeResult] = useState(null)

  // Any 401 means the session expired: send the user back to login
  const handleError = useCallback(
    (err) => {
      if (err.status === 401) {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        navigate('/admin/login', { replace: true })
        return
      }
      setMessage(err.message)
    },
    [navigate]
  )

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const query = date ? `?date=${date}` : ''
      const data = await api(`/admin/bookings${query}`, { admin: true })
      setBookings(data.bookings)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [date, handleError])

  const loadRooms = useCallback(async () => {
    try {
      const data = await api('/admin/rooms', { admin: true })
      setRooms(data.rooms)
    } catch (err) {
      handleError(err)
    }
  }, [handleError])

  useEffect(() => {
    if (tab === 'bookings') loadBookings()
    else loadRooms()
  }, [tab, loadBookings, loadRooms])

  async function setBookingStatus(booking, status) {
    if (status === 'cancelled' && !window.confirm(`Cancel booking ${booking.bookingCode}?`)) {
      return
    }
    setMessage('')
    try {
      await api(`/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        body: { status },
        admin: true,
      })
      setCodeResult((prev) =>
        prev && prev.id === booking.id ? { ...prev, status } : prev
      )
      loadBookings()
    } catch (err) {
      handleError(err)
    }
  }

  async function lookupCode(e) {
    e.preventDefault()
    setMessage('')
    setCodeResult(null)
    const clean = codeInput.trim().toUpperCase()
    if (!clean) return
    try {
      const data = await api(`/admin/bookings/code/${encodeURIComponent(clean)}`, {
        admin: true,
      })
      setCodeResult(data.booking)
    } catch (err) {
      handleError(err)
    }
  }

  async function toggleRoom(room) {
    setMessage('')
    try {
      await api(`/admin/rooms/${room._id}`, {
        method: 'PATCH',
        body: { isActive: !room.isActive },
        admin: true,
      })
      loadRooms()
    } catch (err) {
      handleError(err)
    }
  }

  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-bold tracking-widest text-amber-400">FILM ROOM · ADMIN</span>
          <button
            type="button"
            onClick={logout}
            className="min-h-11 rounded-lg border border-neutral-700 px-4 text-sm hover:border-amber-400"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex gap-2">
          <TabButton active={tab === 'bookings'} onClick={() => setTab('bookings')}>
            Bookings
          </TabButton>
          <TabButton active={tab === 'rooms'} onClick={() => setTab('rooms')}>
            Rooms
          </TabButton>
        </div>

        {message && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{message}</p>
        )}

        {tab === 'bookings' && (
          <>
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
              <h2 className="mb-3 font-semibold">Check a booking by code</h2>
              <form onSubmit={lookupCode} className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Booking code"
                  autoCapitalize="characters"
                  className={`${inputClass} flex-1 font-mono uppercase tracking-widest`}
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg bg-amber-400 px-5 font-semibold text-neutral-950 hover:bg-amber-300"
                >
                  Look up
                </button>
              </form>

              {codeResult && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-neutral-700 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <BookingSummary booking={codeResult} />
                  {codeResult.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => setBookingStatus(codeResult, 'checked_in')}
                      className="min-h-11 rounded-lg bg-sky-500 px-4 font-semibold text-neutral-950 hover:bg-sky-400"
                    >
                      Check in
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label className="mb-1 block text-sm text-neutral-300" htmlFor="filterDate">
                  Date
                </label>
                <input
                  id="filterDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setDate('')}
                  className="ml-2 min-h-11 px-3 text-sm text-neutral-400 hover:text-amber-300"
                >
                  Show all
                </button>
              </div>
              <p className="text-sm text-neutral-400">
                {date ? formatDate(date) : 'All dates'} · {bookings.length} booking
                {bookings.length === 1 ? '' : 's'}
              </p>
            </section>

            {loading && <p className="text-neutral-400">Loading…</p>}
            {!loading && bookings.length === 0 && (
              <p className="text-neutral-400">No bookings for this filter.</p>
            )}

            <div className="space-y-3">
              {bookings.map((b) => (
                <article
                  key={b.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <BookingSummary booking={b} />
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setBookingStatus(b, 'checked_in')}
                          className="min-h-11 flex-1 rounded-lg bg-sky-500 px-4 text-sm font-semibold text-neutral-950 hover:bg-sky-400 sm:flex-none"
                        >
                          Check in
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => setBookingStatus(b, 'cancelled')}
                          className="min-h-11 flex-1 rounded-lg border border-red-800 px-4 text-sm text-red-300 hover:bg-red-950 sm:flex-none"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'rooms' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-neutral-400">Up to {room.capacity} guests</p>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      room.isActive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {room.isActive ? 'Open for booking' : 'Hidden from customers'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRoom(room)}
                  className="min-h-11 shrink-0 rounded-lg border border-neutral-700 px-4 text-sm hover:border-amber-400"
                >
                  {room.isActive ? 'Disable' : 'Enable'}
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${
        active
          ? 'bg-amber-400 text-neutral-950'
          : 'border border-neutral-700 text-neutral-300 hover:border-amber-400'
      }`}
    >
      {children}
    </button>
  )
}

function BookingSummary({ booking }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{booking.room?.name}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[booking.status]}`}>
          {STATUS_TEXT[booking.status]}
        </span>
      </div>
      <p className="text-sm text-neutral-300">
        {formatDate(booking.date)} · {booking.slotLabel}
      </p>
      <p className="text-sm text-neutral-300">
        {booking.customerName} · {booking.phone} · {booking.guests} guest
        {booking.guests === 1 ? '' : 's'}
      </p>
      {booking.email && <p className="truncate text-sm text-neutral-400">{booking.email}</p>}
      {booking.notes && <p className="text-sm text-neutral-400">Note: {booking.notes}</p>}
      <p className="font-mono text-xs tracking-widest text-amber-400">{booking.bookingCode}</p>
    </div>
  )
}
