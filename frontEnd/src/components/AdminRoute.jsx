import { Navigate } from 'react-router-dom'
import { ADMIN_TOKEN_KEY } from '../lib/api.js'

// Only lets through when an admin token is stored.
// The API still validates the token on every request.
export default function AdminRoute({ children }) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}
