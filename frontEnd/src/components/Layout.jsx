import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) =>
  `px-2 py-1 transition-colors ${isActive ? 'text-amber-300' : 'text-indigo-100/80 hover:text-white'}`

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-dark text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-brand-dark/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-lg font-extrabold tracking-[0.2em] text-white">
            FILM<span className="text-amber-300"> ROOM</span>
          </Link>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <a href="/#rooms" className="px-2 py-1 text-indigo-100/80 hover:text-white">
              Rooms
            </a>
            <a href="/#how-it-works" className="px-2 py-1 text-indigo-100/80 hover:text-white">
              How it works
            </a>
            <NavLink to="/check" className={navClass}>
              My booking
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-indigo-200/70 lg:block">
              Open daily 9:00 AM – 11:30 PM
            </span>
            <a
              href="/#rooms"
              className="inline-flex min-h-10 items-center rounded-full bg-amber-300 px-4 text-sm font-semibold text-brand-dark hover:bg-amber-200"
            >
              Book a room
            </a>
          </div>
        </div>

        {/* Mobile links */}
        <nav className="flex justify-center gap-4 border-t border-white/10 py-2 text-xs md:hidden">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <a href="/#rooms" className="px-2 py-1 text-indigo-100/80">
            Rooms
          </a>
          <a href="/#how-it-works" className="px-2 py-1 text-indigo-100/80">
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

      <footer className="border-t border-white/10 bg-brand">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-lg font-extrabold tracking-[0.2em]">FILM ROOM</p>
            <p className="mt-2 text-sm text-indigo-100/70">
              Private film rooms for you and the people you love.
            </p>
          </div>
          <div className="text-sm text-indigo-100/80">
            <p className="font-semibold text-white">Hours</p>
            <p className="mt-2">Every day, 9:00 AM – 11:30 PM</p>
          </div>
          <div className="text-sm text-indigo-100/80">
            <p className="font-semibold text-white">Quick links</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/#rooms" className="hover:text-white">
                  Rooms
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <Link to="/check" className="hover:text-white">
                  Find my booking
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-indigo-200/60">
          <Link to="/admin" className="hover:text-white">
            Staff login
          </Link>
          <span className="mx-2">·</span>
          <span>© {new Date().getFullYear()} Film Room</span>
        </div>
      </footer>
    </div>
  )
}