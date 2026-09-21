'use client'

import { meetings } from '@/src/data/meetings'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logoutAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in by looking for auth cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const filteredMeetings = meetings.filter((meeting) => {
    const query = searchQuery.toLowerCase()
    return (
      meeting.title.toLowerCase().includes(query) ||
      meeting.attendees.some((a) => a.name.toLowerCase().includes(query)) ||
      meeting.transcript.some((t) => t.text.toLowerCase().includes(query))
    )
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Fathom</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium">
                My Meetings
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Shared with Me
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Templates
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 space-y-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p className="font-semibold mb-1">Web Application Portal</p>
            <p className="text-blue-600">Recording Bot Stubbed for Web Execution</p>
          </div>
          {user && (
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <button
                onClick={() => logoutAction()}
                className="mt-3 w-full px-3 py-2 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Meetings</h2>
            <input
              type="text"
              placeholder="Search meetings, transcripts, or attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </header>

        {/* Meeting Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl grid gap-4">
            {filteredMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="block bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(meeting.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {' · '}
                      {Math.floor(meeting.duration / 60)} min
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Recorded
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {meeting.attendees.slice(0, 5).map((attendee) => (
                    <img
                      key={attendee.id}
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      title={attendee.name}
                    />
                  ))}
                  {meeting.attendees.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{meeting.attendees.length - 5} more
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {meeting.summaries.executive}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
