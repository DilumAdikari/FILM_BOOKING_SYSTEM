import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { todayLocal, formatDate } from '../lib/date.js'

const inputClass =
   'w-full min-h-11 rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-base text-white placeholder-indigo-300/50 focus:border-amber-300 focus:outline-none'
const emptyForm = { customerName: '', phone: '', email: '', guests: 1, notes: '' }

export default function BookingForm({ roomId, onSuccess }) {
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
    api(`/rooms/${roomId}`)
      .then((data) => setRoom(data.room))
      .catch((err) => setRoomError(err.message))
  }, [roomId])

  // Reload availability whenever the room, date, or a manual refresh changes
  useEffect(() => {
    let ignore = false
    setSlotsLoading(true)
    api(`/rooms/${roomId}/availability?date=${date}`)
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
  }, [roomId, date, refreshKey])

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
          roomId,
          date,
          slot: selectedSlot,
          ...form,
          guests: Number(form.guests),
        },
      })
      navigate(`/booking/${data.booking.bookingCode}`)
      if (onSuccess) onSuccess()
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

  if (roomError) return <p className="py-10 text-center text-red-300">{roomError}</p>
  if (!room) return <p className="py-10 text-center text-indigo-200/70">Loading…</p>

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{room.name}</h1>
        <p className="mt-1 text-sm text-indigo-200/80">Up to {room.capacity} guests</p>

        <label className="mt-6 block text-sm font-medium text-indigo-100" htmlFor="date">
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

        <h2 className="mt-6 text-sm font-medium text-indigo-100">
          Time slot · {formatDate(date)}
        </h2>
        {slotsLoading && <p className="mt-3 text-sm text-indigo-200/60">Checking availability…</p>}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id
            const base = 'min-h-11 rounded-lg border px-4 py-3 text-left text-sm transition-colors'
            let style
            if (!slot.available) {
              style = 'cursor-not-allowed border-white/5 bg-brand-dark/60 text-indigo-300/40 line-through'
            } else if (isSelected) {
              style = 'border-amber-300 bg-amber-300 font-semibold text-brand-dark'
            } else {
              style = 'border-white/15 bg-brand hover:border-amber-300'
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
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-brand p-5 sm:p-6"
        >
          <h2 className="text-lg font-semibold">Your details</h2>

          <div>
            <label className="mb-1 block text-sm text-indigo-100" htmlFor="customerName">
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
              <label className="mb-1 block text-sm text-indigo-100" htmlFor="phone">
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
              <label className="mb-1 block text-sm text-indigo-100" htmlFor="guests">
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
            <label className="mb-1 block text-sm text-indigo-100" htmlFor="email">
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
            <label className="mb-1 block text-sm text-indigo-100" htmlFor="notes">
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
            className="min-h-12 w-full rounded-full bg-amber-300 px-4 py-3 font-semibold text-brand-dark transition-colors hover:bg-amber-200 disabled:opacity-60"
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>
      </section>
    </div>
  )
}