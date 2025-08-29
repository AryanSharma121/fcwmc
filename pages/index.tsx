import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            FCWMC UNIT-1
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 text-lg">
            Practice MCQs and passage-based questions to strengthen your concepts.
          </p>

          {/* Motivational Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800 font-medium">
               Best of luck! Stay confident, you’ve got this 
            </p>
          </div>

          {/* Start Button */}
          <div className="space-x-3 mb-6">
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 
                         text-white text-lg font-semibold rounded-lg shadow-md transition"
            >
              Start Quiz
            </Link>
          </div>

          {/* Credits */}
          <p className="text-sm text-gray-400">
            Questions credit: <span className="font-semibold text-gray-600">ZATCH</span>
          </p>
          <p className="text-sm text-gray-400">
            Made By: <span className="font-semibold text-gray-600">AIYAA</span>
          </p>
        </div>
      </div>
    </div>
  )
}
