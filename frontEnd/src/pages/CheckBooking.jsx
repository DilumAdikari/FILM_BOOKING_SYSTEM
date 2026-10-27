import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function CheckBooking() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const clean = code.trim().toUpperCase()
    if (!clean) {
      setError('Please enter your booking code.')
      return
    }
    setLoading(true)
    try {
      await api(`/bookings/${encodeURIComponent(clean)}`)
      navigate(`/booking/${clean}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold sm:text-3xl">Find your booking</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Enter the booking code you received to see your QR code and details.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. K7P9-2XMQ"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="w-full min-h-12 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-center font-mono text-lg uppercase tracking-widest text-neutral-100 placeholder-neutral-600 focus:border-amber-400 focus:outline-none"
        />
        {error && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Show my booking'}
        </button>
      </form>
    </div>
  )
}
