import Link from 'next/link'
export default function Result() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <p className="mb-4">This demo uses client-side state. Scores aren't saved.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">Home</Link>
      </div>
    </div>
  )
}
