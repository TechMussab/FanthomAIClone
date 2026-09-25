'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logoutAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allMeetings, setAllMeetings] = useState<any[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Check Auth
        const authRes = await fetch('/api/auth/check')
        if (!authRes.ok) {
          router.push('/login')
          return
        }
        const userData = await authRes.json()
        setUser(userData)

        // 2. Check Onboarding
        const onboardingComplete = localStorage.getItem('fathom_onboarding_complete')
        if (!onboardingComplete) {
          router.push('/onboarding')
          return
        }

        // 3. Fetch Meetings from Database / API - NO FALLBACK
        console.log('[Dashboard] Fetching meetings from /api/meetings')
        const meetingsRes = await fetch('/api/meetings')
        if (!meetingsRes.ok) {
          throw new Error(`API error: ${meetingsRes.status}`)
        }
        const dbMeetings = await meetingsRes.json()

        if (!Array.isArray(dbMeetings)) {
          throw new Error('Invalid response format from database')
        }

        if (dbMeetings.length === 0) {
          setError('No meetings found in database. Please configure Supabase and seed data.')
          console.warn('[Dashboard] Database is empty - add meetings via /api/meetings POST')
        }

        console.log(`[Dashboard] Retrieved ${dbMeetings.length} meetings from database`)
        setAllMeetings(dbMeetings)
      } catch (err) {
        console.error('[Dashboard] Error:', err)
        setError(`Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setAllMeetings([])
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading meetings from database...</p>
      </div>
    )
  }

  const filteredMeetings = allMeetings.filter((meeting) => {
    const query = searchQuery.toLowerCase()
    const titleMatch = (meeting.title || '').toLowerCase().includes(query)
    const attendeeMatch = Array.isArray(meeting.attendees) && meeting.attendees.some((a: any) =>
      (a.name || '').toLowerCase().includes(query)
    )
    const transcriptMatch = Array.isArray(meeting.transcript) && meeting.transcript.some((t: any) => {
      const text = t.text || ''
      return text.toLowerCase().includes(query)
    })
    return titleMatch || attendeeMatch || transcriptMatch
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
            <p className="font-semibold mb-1">Live Database Connection</p>
            <p className="text-blue-600">Supabase PostgreSQL</p>
          </div>
          {user && (
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <div className="space-y-2 mt-3">
                <button
                  onClick={() => {
                    localStorage.removeItem('fathom_onboarding_complete')
                    router.push('/onboarding')
                  }}
                  className="w-full px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
                >
                  Replay Onboarding
                </button>
                <button
                  onClick={() => logoutAction()}
                  className="w-full px-3 py-2 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium"
                >
                  Sign Out
                </button>
              </div>
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
          <div className="max-w-4xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
                </p>
              </div>
            )}

            {filteredMeetings.length === 0 && !error && (
              <p className="text-gray-500">No meetings found.</p>
            )}

            <div className="grid gap-4">
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
                        {typeof meeting.duration === 'string' ? meeting.duration : `${Math.floor(Number(meeting.duration) / 60)} min`}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Recorded
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {Array.isArray(meeting.attendees) && meeting.attendees.slice(0, 5).map((attendee: any, idx: number) => (
                      <img
                        key={attendee.id || idx}
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={attendee.name}
                      />
                    ))}
                    {Array.isArray(meeting.attendees) && meeting.attendees.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{meeting.attendees.length - 5} more
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {meeting.summaries?.executive}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
