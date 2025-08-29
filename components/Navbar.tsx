import Link from 'next/link'
export default function Navbar(){
  return (
    <nav className="w-full bg-white shadow p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold">CBT Practice</Link>
        <div className="text-sm text-gray-600">Ready to revise?</div>
      </div>
    </nav>
  )
}
