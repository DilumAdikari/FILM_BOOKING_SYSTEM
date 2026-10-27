import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ADMIN_TOKEN_KEY } from '../lib/api.js'

const inputClass =
  'w-full min-h-11 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 focus:border-amber-400 focus:outline-none'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/admin/login', {
        method: 'POST',
        body: { username, password },
      })
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8"
      >
        <div>
          <h1 className="text-xl font-bold text-amber-400">Staff login</h1>
          <p className="mt-1 text-sm text-neutral-400">Film Room admin</p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            required
            autoComplete="username"
            autoCapitalize="none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
