import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) =>
  `px-2 py-1 transition-colors ${isActive ? 'text-amber-400' : 'text-neutral-300 hover:text-amber-300'}`

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-lg font-bold tracking-widest text-amber-400">
            FILM ROOM
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-3">
            <NavLink to="/" end className={navClass}>
              Rooms
            </NavLink>
            <NavLink to="/check" className={navClass}>
              My booking
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <Link to="/admin" className="hover:text-neutral-300">
          Staff login
        </Link>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Film Room</span>
      </footer>
    </div>
  )
}
