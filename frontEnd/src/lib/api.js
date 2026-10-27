const BASE_URL = '/api'
export const ADMIN_TOKEN_KEY = 'filmroom_admin_token'

// Small fetch wrapper: JSON in/out, throws Error(message) on failure.
export async function api(path, { method = 'GET', body, admin = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (admin) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong')
    err.status = res.status
    throw err
  }
  return data
}
