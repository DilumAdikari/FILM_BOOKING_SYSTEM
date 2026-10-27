import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

const FEATURES = ['Private rooms', 'Up to 6 guests', 'Instant QR booking', 'Flexible time slots']

const STEPS = [
  {
    title: 'Choose a room and time',
    text: 'Pick a date and one of the free time slots for the room you like.',
  },
  {
    title: 'Enter your details',
    text: 'Add your name, phone number and how many guests are coming.',
  },
  {
    title: 'Get your QR code',
    text: 'Your booking is confirmed right away. Show the QR code at the entrance.',
  },
]

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
    <div className="space-y-20 sm:space-y-28">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-light via-brand to-brand-dark px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Private film rooms
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Your movie, <em className="font-serif font-normal italic text-amber-300">your</em> room.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-indigo-100/80 sm:text-lg">
          Book a private room for friends, family or a date night. Pick a time that suits you and
          get your QR code in seconds.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#rooms"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber-300 px-8 font-semibold text-brand-dark hover:bg-amber-200 sm:w-auto"
          >
            Book a room now
          </a>
          <Link
            to="/check"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/30 px-8 font-semibold hover:border-white sm:w-auto"
          >
            I already have a code
          </Link>
        </div>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-indigo-100 sm:text-sm"
            >
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* Rooms */}
      <section id="rooms" className="scroll-mt-28">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Choose your room
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Pick your screen</h2>
        </div>

        {loading && <p className="text-center text-indigo-200/70">Loading rooms…</p>}
        {error && <p className="text-center text-red-300">{error}</p>}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <article
              key={room._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand"
            >
              <div className="relative flex h-40 items-end bg-gradient-to-br from-brand-light to-brand-dark p-5">
                <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100">
                  Room {index + 1}
                </span>
                <span className="text-2xl font-extrabold text-white/90">{room.name}</span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div>
                  <p className="text-sm text-indigo-200/80">Up to {room.capacity} guests</p>
                  {room.description && (
                    <p className="mt-2 text-sm text-indigo-100/80">{room.description}</p>
                  )}
                </div>
                <Link
                  to={`/rooms/${room._id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-300 px-4 font-semibold text-brand-dark transition-colors hover:bg-amber-200"
                >
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!loading && !error && rooms.length === 0 && (
          <p className="text-center text-indigo-200/70">No rooms are available right now.</p>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-28">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Three simple steps</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-white/10 bg-brand p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 font-bold text-brand-dark">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-indigo-100/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing CTA */}
      <section className="rounded-3xl border border-white/10 bg-brand px-6 py-12 text-center sm:py-16">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Ready for movie night?</h2>
        <p className="mt-2 text-indigo-100/80">Choose a room and time, and you are all set.</p>
        <a
          href="#rooms"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-8 font-semibold text-brand-dark hover:bg-amber-200"
        >
          Book now
        </a>
      </section>
    </div>
  )
}