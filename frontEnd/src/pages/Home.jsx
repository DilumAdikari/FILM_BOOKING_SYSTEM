import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/rooms')
      .then((data) => setRooms(data.rooms))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Book a private film room</h1>
        <p className="mt-2 text-sm text-neutral-400 sm:text-base">
          Pick a room, choose a date and time, and get your booking QR code.
        </p>
      </div>

      {loading && <p className="text-neutral-400">Loading rooms…</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <article
            key={room._id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div>
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Up to {room.capacity} guests
              </p>
              {room.description && (
                <p className="mt-2 text-sm text-neutral-300">{room.description}</p>
              )}
            </div>
            <Link
              to={`/rooms/${room._id}`}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-4 font-semibold text-neutral-950 transition-colors hover:bg-amber-300"
            >
              Book this room
            </Link>
          </article>
        ))}
      </div>

      {!loading && !error && rooms.length === 0 && (
        <p className="text-neutral-400">No rooms are available right now.</p>
      )}
    </section>
  )
}
