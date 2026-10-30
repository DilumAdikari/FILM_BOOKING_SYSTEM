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
      <h1 className="font-serif text-3xl sm:text-4xl">Find your booking</h1>
      <p className="mt-2 text-sm text-slate-600">
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
          className="w-full min-h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 text-center font-mono text-lg uppercase tracking-widest text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:outline-none"
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-full bg-amber-400 px-4 py-3 font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Show my booking'}
        </button>
      </form>
    </div>
  )
}