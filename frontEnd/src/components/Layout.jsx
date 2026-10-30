import { Link, NavLink, useLocation } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'

export default function Layout({ children }) {
  const { openBooking } = useBooking()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Home: transparent header over the hero photo (light text).
  // Other pages: white sticky header (dark text).
  const linkTone = isHome ? 'text-white/85 hover:text-white' : 'text-slate-600 hover:text-slate-900'
  const activeTone = isHome ? 'text-amber-300' : 'text-amber-600'
  const navClass = ({ isActive }) =>
    `px-2 py-1 transition-colors ${isActive ? activeTone : linkTone}`

  const headerClass = isHome
    ? 'absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-transparent text-white'
    : 'sticky top-0 z-20 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur'

  const accent = isHome ? 'text-amber-300' : 'text-amber-500'
  const hoursTone = isHome ? 'text-white/75' : 'text-slate-500'

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white text-slate-900">
      <header className={headerClass}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-lg font-extrabold tracking-[0.2em]">
            FILM<span className={accent}> ROOM</span>
          </Link>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <a href="/#rooms" className={`px-2 py-1 transition-colors ${linkTone}`}>
              Rooms
            </a>
            <a href="/#how-it-works" className={`px-2 py-1 transition-colors ${linkTone}`}>
              How it works
            </a>
            <NavLink to="/check" className={navClass}>
              My booking
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className={`hidden text-xs lg:block ${hoursTone}`}>
              Open daily 9:00 AM – 11:30 PM
            </span>
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex min-h-10 items-center rounded-full bg-amber-400 px-4 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Book a room
            </button>
          </div>
        </div>

        {/* Mobile links */}
        <nav
          className={`flex justify-center gap-4 py-2 text-xs md:hidden ${
            isHome ? '' : 'border-t border-slate-200'
          }`}
        >
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <a href="/#rooms" className={`px-2 py-1 transition-colors ${linkTone}`}>
            Rooms
          </a>
          <a href="/#how-it-works" className={`px-2 py-1 transition-colors ${linkTone}`}>
            How it works
          </a>
          <NavLink to="/check" className={navClass}>
            My booking
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-lg font-extrabold tracking-[0.2em] text-slate-900">FILM ROOM</p>
            <p className="mt-2 text-sm text-slate-600">
              Private film rooms for you and the people you love.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Hours</p>
            <p className="mt-2">Every day, 9:00 AM – 11:30 PM</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Quick links</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/#rooms" className="hover:text-slate-900">
                  Rooms
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-slate-900">
                  How it works
                </a>
              </li>
              <li>
                <Link to="/check" className="hover:text-slate-900">
                  Find my booking
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          <Link to="/admin" className="hover:text-slate-900">
            Staff login
          </Link>
          <span className="mx-2">·</span>
          <span>© {new Date().getFullYear()} Film Room</span>
        </div>
      </footer>
    </div>
  )
}