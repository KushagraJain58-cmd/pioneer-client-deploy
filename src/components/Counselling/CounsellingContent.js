import { useContext } from "react"
import CounsellingContext from "../../context/counsellingContext"
import CounselorDetailModal from "./CounselorDetailModal"
import BookingConfirmationModal from "./BookingConfirmationModal"
import PageHeader from "../PageHeader"
import { PLACEHOLDER_AVATAR } from "./placeholder"

function CounsellingContent() {
  const { counselors, loading, error, setSelectedCounselor, setShowDetailModal } =
    useContext(CounsellingContext)

  const handleCounselorClick = (counselor) => {
    setSelectedCounselor(counselor)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="1-to-1 Counselling" />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading counsellors...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : counselors.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No counsellors available right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {counselors.map((counselor) => (
                <div
                  key={counselor._id}
                  onClick={() => handleCounselorClick(counselor)}
                  className="bg-white rounded-xl p-2 shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <div className="relative h-60 overflow-hidden bg-slate-200">
                    <img
                      src={counselor.profileImage || PLACEHOLDER_AVATAR}
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
                      alt={counselor.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{counselor.fullName}</h3>
                    <p className="text-indigo-600 font-semibold text-xs mb-3 uppercase">{counselor.title}</p>
                    {counselor.shortDescription && (
                      <p className="text-slate-700 text-xs line-clamp-2 mb-3">{counselor.shortDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {counselor.keywords?.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CounselorDetailModal />
        <BookingConfirmationModal />
      </main>
    </div>
  )
}

export default function CounsellingPage() {
  return <CounsellingContent />
}
