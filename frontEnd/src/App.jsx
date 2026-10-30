import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import BookingModal from './components/BookingModal.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import Home from './pages/Home.jsx'
import BookRoom from './pages/BookRoom.jsx'
import BookingDetails from './pages/BookingDetails.jsx'
import CheckBooking from './pages/CheckBooking.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-serif text-3xl">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-amber-600 hover:underline">
        Back to rooms
      </Link>
    </div>
  )
}

function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/rooms/:id" element={<Layout><BookRoom /></Layout>} />
        <Route path="/booking/:code" element={<Layout><BookingDetails /></Layout>} />
        <Route path="/check" element={<Layout><CheckBooking /></Layout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>

      <BookingModal />
    </BookingProvider>
  )
}

export default App