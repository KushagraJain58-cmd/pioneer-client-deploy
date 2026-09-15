import { createContext, useEffect, useState } from "react"
import useAxiosInstance from "../lib/useAxiosInstance"

const CounsellingContext = createContext({
  counselors: [],
  loading: false,
  error: null,
  selectedCounselor: null,
  setSelectedCounselor: () => {},
  showDetailModal: false,
  setShowDetailModal: () => {},
  selectedSlot: null,
  setSelectedSlot: () => {},
  bookedSession: null,
  setBookedSession: () => {},
  showConfirmation: false,
  setShowConfirmation: () => {},
})

// Counsellor slot scheduling isn't stored in the backend yet, so offer
// generic upcoming weekday slots for booking.
const buildUpcomingSlots = (counselorId) => {
  const times = ["4:00 PM", "5:00 PM"]
  const slots = []
  const day = new Date()
  while (slots.length < 4) {
    day.setDate(day.getDate() + 1)
    if (day.getDay() === 0) continue
    const date = day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
    times.forEach((time) => {
      if (slots.length < 4) slots.push({ id: `${counselorId}-${date}-${time}`, date, time })
    })
  }
  return slots
}

export const CounsellingProvider = ({ children }) => {
  const axios = useAxiosInstance()
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookedSession, setBookedSession] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    let cancelled = false
    axios
      .get("/api/counsellors")
      .then((res) => {
        if (cancelled) return
        const list = (res.data?.data || []).map((c) => ({
          ...c,
          availableSlots: buildUpcomingSlots(c._id),
        }))
        setCounselors(list)
      })
      .catch((err) => !cancelled && setError(err?.response?.data?.message || "Failed to load counsellors"))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CounsellingContext.Provider
      value={{
        counselors,
        loading,
        error,
        selectedCounselor,
        setSelectedCounselor,
        showDetailModal,
        setShowDetailModal,
        selectedSlot,
        setSelectedSlot,
        bookedSession,
        setBookedSession,
        showConfirmation,
        setShowConfirmation,
      }}
    >
      {children}
    </CounsellingContext.Provider>
  )
}

export default CounsellingContext
