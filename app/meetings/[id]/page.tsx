'use client'

import { meetings, ytArchitectureMeeting } from '@/src/data/meetings'
import { useState, useRef, use, useEffect, useCallback } from 'react'
import Link from 'next/link'
import YouTube, { YouTubeProps } from 'react-youtube'

interface MeetingDetailPageProps {
  params: Promise<{
    id: string
  }>
}

type MeetingType = typeof meetings[0] | typeof ytArchitectureMeeting

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = use(params)

  // Support both regular meetings and YouTube meetings
  let meeting: MeetingType | undefined
  if (id === 'meeting-mvvm-vs-mvi') {
    meeting = ytArchitectureMeeting
  } else {
    meeting = meetings.find((m) => m.id === id)
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const youtubeRef = useRef<any>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [summaryTab, setSummaryTab] = useState<'executive' | 'engineering' | 'sales' | 'actionItems'>(
    'executive'
  )
  const [showShareModal, setShowShareModal] = useState(false)

  const isYouTube = meeting && 'type' in meeting && meeting.type === 'youtube'

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleTranscriptClick = useCallback((timestamp: number) => {
    if (isYouTube && youtubeRef.current) {
      youtubeRef.current.internalPlayer?.seekTo(timestamp, true)
    } else if (!isYouTube && videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }, [isYouTube])

  const handleVideoTimeUpdate = useCallback(() => {
    if (!isYouTube && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [isYouTube])

  const handleYouTubeStateChange = useCallback((event: any) => {
    if (event.target?.getCurrentTime) {
      setCurrentTime(event.target.getCurrentTime())
    }
  }, [])

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${meeting.id}`
    : `/share/${meeting.id}`

  // Get transcript field name (YouTube uses startSeconds, regular meetings use timestamp)
  const getTimestampField = (entry: any): number => {
    return 'startSeconds' in entry ? entry.startSeconds : entry.timestamp
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Fathom
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                My Meetings
              </Link>
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
        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p className="font-semibold mb-1">Web Application Portal</p>
            <p className="text-blue-600">Recording Bot Stubbed for Web Execution</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Back to Meetings
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(meeting.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              {' · '}
              {typeof meeting.duration === 'string' ? meeting.duration : `${Math.floor(meeting.duration / 60)} minutes`}
              {isYouTube && ' · YouTube Video'}
            </p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Share
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Video & Transcript Section */}
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Video Player */}
            <div className="bg-black">
              {isYouTube ? (
                <YouTube
                  videoId={'youtubeId' in meeting ? meeting.youtubeId : ''}
                  opts={opts}
                  onStateChange={handleYouTubeStateChange}
                  ref={youtubeRef}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={meeting.videoUrl || undefined}
                  onTimeUpdate={handleVideoTimeUpdate}
                  controls
                  className="w-full"
                />
              )}
            </div>

            {/* Transcript */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Transcript</h3>
              <div className="space-y-3">
                {meeting.transcript.map((entry, idx) => {
                  const timestamp = getTimestampField(entry)
                  const speaker = 'speaker' in entry ? entry.speaker : "Unknown Speaker"
                  const text = 'text' in entry ? entry.text : ""
                  const avatar = 'avatar' in entry ? entry.avatar : (entry as any).avatar

                  return (
                    <div
                      key={idx}
                      onClick={() => handleTranscriptClick(timestamp)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        Math.abs(currentTime - timestamp) < 2
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {avatar && (
                          <img
                            src={avatar}
                            alt={speaker}
                            className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{speaker}</span>
                            <span className="text-xs text-gray-500">
                              {Math.floor(timestamp / 60)}:{(timestamp % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{text}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary & Details Section */}
          <div className="w-96 flex flex-col gap-6">
            {/* AI Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">AI Summary</h3>

              {/* Template Tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-200">
                {['executive', 'engineering', 'sales', 'actionItems'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSummaryTab(tab as any)}
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      summaryTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'actionItems' ? 'Action Items' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Summary Content */}
              <div className="space-y-3">
                {summaryTab === 'actionItems' ? (
                  <ul className="space-y-2">
                    {meeting.summaries.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <input
                          type="checkbox"
                          className="mt-1 rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {summaryTab === 'executive'
                      ? meeting.summaries.executive
                      : summaryTab === 'engineering'
                        ? meeting.summaries.engineering
                        : 'sales' in meeting.summaries
                          ? meeting.summaries.sales
                          : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Attendees</h3>
              <div className="space-y-2">
                {meeting.attendees.map((attendee) => (
                  <div key={attendee.id || attendee.name} className="flex items-center gap-2">
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                      <p className="text-xs text-gray-500">{attendee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Share Meeting</h2>
            <p className="text-sm text-gray-600 mb-4">
              Anyone with this link can view this meeting without logging in:
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                  alert('Link copied to clipboard!')
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
