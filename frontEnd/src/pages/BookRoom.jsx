import { Link, useParams } from 'react-router-dom'
import BookingForm from '../components/BookingForm.jsx'

export default function BookRoom() {
  const { id } = useParams()

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-amber-600">
        ← All rooms
      </Link>
      <div className="mt-4">
        <BookingForm key={id} roomId={id} />
      </div>
    </div>
  )
}