import { useEffect, useState } from 'react'
import { useBooking } from '../context/BookingContext.jsx'
import { api } from '../lib/api.js'
import BookingForm from './BookingForm.jsx'

export default function BookingModal() {
  const { isOpen, roomId, chooseRoom, closeBooking } = useBooking()
  const [rooms, setRooms] = useState([])
  const [roomsError, setRoomsError] = useState('')

  // Load the room list for the picker (only when no room is chosen yet)
  useEffect(() => {
    if (!isOpen || roomId) return
    let ignore = false
    api('/rooms')
      .then((data) => {
        if (!ignore) setRooms(data.rooms)
      })
      .catch((err) => {
        if (!ignore) setRoomsError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [isOpen, roomId])

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeBooking()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeBooking])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a room"
      onClick={closeBooking}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-brand-dark p-5 text-white sm:p-8"
      >
        <button
          type="button"
          onClick={closeBooking}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl hover:bg-white/20"
        >
          ×
        </button>

        {roomId ? (
          <>
            <button
              type="button"
              onClick={() => chooseRoom(null)}
              className="mb-4 text-sm text-indigo-200/70 hover:text-amber-300"
            >
              ← Choose another room
            </button>
            <BookingForm roomId={roomId} onSuccess={closeBooking} />
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Step 1 of 2
            </p>
            <h2 className="mt-2 pr-12 text-2xl font-extrabold sm:text-3xl">Choose a room</h2>
            <p className="mt-1 text-sm text-indigo-200/80">
              Pick a room, then choose your date and time.
            </p>

            {roomsError && <p className="mt-4 text-red-300">{roomsError}</p>}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <button
                  key={room._id}
                  type="button"
                  onClick={() => chooseRoom(room._id)}
                  className="rounded-2xl border border-white/10 bg-brand p-5 text-left transition-colors hover:border-amber-300"
                >
                  <span className="block text-lg font-bold">{room.name}</span>
                  <span className="mt-1 block text-sm text-indigo-200/80">
                    Up to {room.capacity} guests
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}