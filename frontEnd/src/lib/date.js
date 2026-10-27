// Cinema timezone (must match the backend)
const TIMEZONE = 'Asia/Colombo'

// Today as YYYY-MM-DD in the cinema timezone
export function todayLocal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE })
}

// "2026-10-27" -> "Tue, 27 Oct 2026"
export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
