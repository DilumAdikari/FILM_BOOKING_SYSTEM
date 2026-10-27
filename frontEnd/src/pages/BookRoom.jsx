import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { todayLocal, formatDate } from '../lib/date.js'

const inputClass =
  'w-full min-h-11 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none'

const emptyForm = { customerName: '', phone: '', email: '', guests: 1, notes: '' }

export default function BookRoom() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [roomError, setRoomError] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    api(`/rooms/${id}`)
      .then((data) => setRoom(data.room))
      .catch((err) => setRoomError(err.message))
  }, [id])

  // Reload availability whenever the room, date, or a manual refresh changes
  useEffect(() => {
    let ignore = false
    setSlotsLoading(true)
    api(`/rooms/${id}/availability?date=${date}`)
      .then((data) => {
        if (!ignore) setSlots(data.slots)
      })
      .catch((err) => {
        if (!ignore) setSubmitError(err.message)
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id, date, refreshKey])

  function handleDateChange(e) {
    setDate(e.target.value)
    setSelectedSlot('')
  }

  function updateField(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    if (!selectedSlot) {
      setSubmitError('Please choose a time slot.')
      return
    }
    setSubmitting(true)
    try {
      const data = await api('/bookings', {
        method: 'POST',
        body: {
          roomId: id,
          date,
          slot: selectedSlot,
          ...form,
          guests: Number(form.guests),
        },
      })
      navigate(`/booking/${data.booking.bookingCode}`)
    } catch (err) {
      setSubmitError(err.message)
      // The slot may have been taken meanwhile, so refresh availability
      if (err.status === 409) {
        setSelectedSlot('')
        setRefreshKey((k) => k + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (roomError) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400">{roomError}</p>
        <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
          Back to rooms
        </Link>
      </div>
    )
  }

  if (!room) return <p className="text-neutral-400">Loading…</p>

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <section>
        <Link to="/" className="text-sm text-neutral-400 hover:text-amber-300">
          ← All rooms
        </Link>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{room.name}</h1>
        <p className="mt-1 text-sm text-neutral-400">Up to {room.capacity} guests</p>

        <label className="mt-6 block text-sm font-medium text-neutral-300" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          min={todayLocal()}
          value={date}
          onChange={handleDateChange}
          className={`${inputClass} mt-2`}
        />

        <h2 className="mt-6 text-sm font-medium text-neutral-300">
          Time slot · {formatDate(date)}
        </h2>
        {slotsLoading && <p className="mt-3 text-sm text-neutral-500">Checking availability…</p>}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id
            const base =
              'min-h-11 rounded-lg border px-4 py-3 text-left text-sm transition-colors'
            let style
            if (!slot.available) {
              style = 'cursor-not-allowed border-neutral-800 bg-neutral-900 text-neutral-600 line-through'
            } else if (isSelected) {
              style = 'border-amber-400 bg-amber-400 font-semibold text-neutral-950'
            } else {
              style = 'border-neutral-700 bg-neutral-900 hover:border-amber-400'
            }
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.id)}
                className={`${base} ${style}`}
              >
                {slot.start} – {slot.end}
                {!slot.available && <span className="ml-2 no-underline">(unavailable)</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Your details</h2>

          <div>
            <label className="mb-1 block text-sm text-neutral-300" htmlFor="customerName">
              Full name *
            </label>
            <input
              id="customerName"
              name="customerName"
              required
              autoComplete="name"
              value={form.customerName}
              onChange={updateField}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-neutral-300" htmlFor="phone">
                Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={updateField}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-neutral-300" htmlFor="guests">
                Guests *
              </label>
              <input
                id="guests"
                name="guests"
                type="number"
                inputMode="numeric"
                min={1}
                max={room.capacity}
                required
                value={form.guests}
                onChange={updateField}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300" htmlFor="email">
              Email (optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300" htmlFor="notes">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={500}
              value={form.notes}
              onChange={updateField}
              className={`${inputClass} min-h-24`}
            />
          </div>

          {submitError && (
            <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-12 w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </section>
    </div>
  )
}
