import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [roomId, setRoomId] = useState(null)

  const openBooking = useCallback((id = null) => {
    setRoomId(id)
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    setRoomId(null)
  }, [])

  const value = useMemo(
    () => ({ isOpen, roomId, openBooking, closeBooking, chooseRoom: setRoomId }),
    [isOpen, roomId, openBooking, closeBooking]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}