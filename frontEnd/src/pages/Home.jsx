import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import Reveal from '../components/Reveal.jsx'

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

  const featured = rooms[0]

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero (full width, photo background, light text) */}
      <section className="relative isolate -mt-8 left-1/2 flex min-h-[70vh] w-screen -translate-x-1/2 flex-col justify-center overflow-hidden text-white sm:-mt-12 sm:min-h-[640px]">
        {/* Background photo: put your image at frontEnd/public/Hero.jpg */}
        <img
          src="/Hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/10" />

        {/* Decorative dashed route line */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40"
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
        >
          <path
            d="M640 0 C 380 120, 780 260, 580 420 S 720 640, 900 800"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </svg>

        <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Private film rooms
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-normal leading-[1.05] sm:text-7xl">
            Your movie, <em className="text-amber-300">your</em> room.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-200 sm:text-lg">
            Book a private room for friends, family or a date night. Pick a time that suits you and
            get your QR code in seconds.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#rooms"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-400 px-8 font-semibold text-slate-900 hover:bg-amber-300 sm:w-auto"
            >
              Book a room now
            </a>
            <Link
              to="/check"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-8 font-semibold hover:border-white sm:w-auto"
            >
              I already have a code
            </Link>
          </div>

          {/* Featured room card */}
          {featured && (
            <Link
              to={`/rooms/${featured._id}`}
              className="mt-10 inline-flex max-w-sm flex-col rounded-2xl border border-white/20 bg-slate-950/70 p-5 backdrop-blur transition-colors hover:border-amber-300"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-amber-300">Featured room</span>
              <span className="mt-2 font-serif text-2xl">{featured.name}</span>
              <span className="mt-1 text-sm text-slate-200">Up to {featured.capacity} guests</span>
            </Link>
          )}
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="scroll-mt-28">
        <Reveal>
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              Choose your room
            </p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-5xl">
              Pick your screen
            </h2>
          </div>
        </Reveal>

        {loading && <p className="text-center text-slate-500">Loading rooms…</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <Reveal key={room._id} delay={(index % 3) * 120} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative flex h-40 items-end overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 p-5">
                  <img
                    src={`/rooms/room-${index + 1}.jpg`}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                    Room {index + 1}
                  </span>
                  <span className="relative font-serif text-2xl text-white">{room.name}</span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm text-slate-500">Up to {room.capacity} guests</p>
                    {room.description && (
                      <p className="mt-2 text-sm text-slate-600">{room.description}</p>
                    )}
                  </div>
                  <Link
                    to={`/rooms/${room._id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-400 px-4 font-semibold text-slate-900 transition-colors hover:bg-amber-300"
                  >
                    Book now
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {!loading && !error && rooms.length === 0 && (
          <p className="text-center text-slate-500">No rooms are available right now.</p>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-28">
        <Reveal>
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
              How it works
            </p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-5xl">
              Three simple steps
            </h2>
          </div>
        </Reveal>
        <ol className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120} className="h-full">
              <li className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:py-16">
          <h2 className="font-serif text-3xl font-normal sm:text-4xl">Ready for movie night?</h2>
          <p className="mt-2 text-slate-300">Choose a room and time, and you are all set.</p>
          <a
            href="#rooms"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-amber-400 px-8 font-semibold text-slate-900 hover:bg-amber-300"
          >
            Book now
          </a>
        </section>
      </Reveal>
    </div>
  )
}