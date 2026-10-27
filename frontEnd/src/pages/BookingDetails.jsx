import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { formatDate } from '../lib/date.js'

const STATUS_LABEL = {
  confirmed: { text: 'Confirmed', cls: 'bg-emerald-900 text-emerald-300' },
  checked_in: { text: 'Checked in', cls: 'bg-sky-900 text-sky-300' },
  cancelled: { text: 'Cancelled', cls: 'bg-red-950 text-red-300' },
}

export default function BookingDetails() {
  const { code } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/bookings/${code}`)
      .then((data) => setBooking(data.booking))
      .catch((err) => setError(err.message))
  }, [code])

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400">{error}</p>
        <Link to="/check" className="mt-4 inline-block text-amber-400 hover:underline">
          Try another code
        </Link>
      </div>
    )
  }
  if (!booking) return <p className="text-neutral-400">Loading booking…</p>

  const status = STATUS_LABEL[booking.status] || STATUS_LABEL.confirmed

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">Your booking</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
            {status.text}
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center rounded-xl bg-white p-4">
          <img
            src={booking.qrDataUrl}
            alt={`QR code for booking ${booking.bookingCode}`}
            className="h-auto w-full max-w-60"
          />
          <p className="mt-3 font-mono text-lg tracking-widest text-neutral-900">
            {booking.bookingCode}
          </p>
        </div>
        <p className="mt-3 text-center text-sm text-neutral-400">
          Show this QR code or booking code at the entrance.
        </p>

        <dl className="mt-6 divide-y divide-neutral-800 text-sm">
          <Row label="Room" value={booking.room?.name} />
          <Row label="Date" value={formatDate(booking.date)} />
          <Row label="Time" value={booking.slotLabel} />
          <Row label="Name" value={booking.customerName} />
          <Row label="Guests" value={booking.guests} />
          {booking.notes && <Row label="Notes" value={booking.notes} />}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-11 flex-1 rounded-lg border border-neutral-700 px-4 py-3 font-medium hover:border-amber-400"
          >
            Print
          </button>
          <Link
            to="/"
            className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 hover:bg-amber-300"
          >
            Book another room
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
