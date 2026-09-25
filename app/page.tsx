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
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading meetings from database...</p>
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
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Fathom
          </h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-4 py-2 text-slate-200 bg-slate-800/50 rounded-lg font-medium">
                My Meetings
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-slate-400 hover:bg-slate-800/30 rounded-lg transition-colors">
                Shared with Me
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-slate-400 hover:bg-slate-800/30 rounded-lg transition-colors">
                Templates
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-slate-400 hover:bg-slate-800/30 rounded-lg transition-colors">
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 space-y-4 border-t border-slate-800">
          <div className="px-4 py-3 bg-indigo-950/50 border border-indigo-900/50 rounded-lg text-xs">
            <p className="font-semibold text-indigo-300 mb-1">Live Database Connection</p>
            <p className="text-indigo-400">Supabase PostgreSQL</p>
          </div>
          {user && (
            <div className="px-4 py-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <div className="space-y-2 mt-3">
                <button
                  onClick={() => {
                    localStorage.removeItem('fathom_onboarding_complete')
                    router.push('/onboarding')
                  }}
                  className="w-full px-3 py-2 text-xs bg-indigo-950/50 text-indigo-400 rounded hover:bg-indigo-900/50 font-medium transition-colors border border-indigo-900/50"
                >
                  Replay Onboarding
                </button>
                <button
                  onClick={() => logoutAction()}
                  className="w-full px-3 py-2 text-xs bg-red-950/50 text-red-400 rounded hover:bg-red-900/50 font-medium transition-colors border border-red-900/50"
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
        <header className="bg-slate-900/50 border-b border-slate-800 p-6">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">My Meetings</h2>
            <input
              type="text"
              placeholder="Search meetings, transcripts, or attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </header>

        {/* Meeting Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            {error && (
              <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
                <p className="text-xs text-red-500 mt-2">
                  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
                </p>
              </div>
            )}

            {filteredMeetings.length === 0 && !error && (
              <p className="text-slate-400">No meetings found.</p>
            )}

            <div className="grid gap-4">
              {filteredMeetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/meetings/${meeting.id}`}
                  className="block bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{meeting.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {' · '}
                        {typeof meeting.duration === 'string' ? meeting.duration : `${Math.floor(Number(meeting.duration) / 60)} min`}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-950/50 text-indigo-300 text-xs font-medium rounded-full border border-indigo-900/50">
                      Recorded
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {Array.isArray(meeting.attendees) && meeting.attendees.slice(0, 5).map((attendee: any, idx: number) => (
                      <img
                        key={attendee.id || idx}
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-8 h-8 rounded-full border-2 border-slate-700"
                        title={attendee.name}
                      />
                    ))}
                    {Array.isArray(meeting.attendees) && meeting.attendees.length > 5 && (
                      <span className="text-xs text-slate-500">
                        +{meeting.attendees.length - 5} more
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2">
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
