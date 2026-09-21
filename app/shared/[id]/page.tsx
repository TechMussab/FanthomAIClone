'use client'

import { meetings } from '@/src/data/meetings'
import Link from 'next/link'
import { use } from 'react'

interface SharedMeetingPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SharedMeetingPage({ params }: SharedMeetingPageProps) {
  const { id } = use(params)
  const meeting = meetings.find((m) => m.id === id)

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting not found</h1>
          <p className="text-gray-600 mb-6">This shared link may have expired or been removed.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Fathom</h1>
          <p className="text-sm text-gray-500">Shared Meeting</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Meeting Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{meeting.title}</h1>
            <p className="text-gray-600">
              {new Date(meeting.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              {' · '}
              {Math.floor(meeting.duration / 60)} minutes
            </p>
          </div>

          {/* Video Player */}
          <div className="bg-black aspect-video">
            <video
              src={meeting.videoUrl}
              controls
              className="w-full h-full"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Summary */}
            <div className="col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{meeting.summaries.executive}</p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Action Items</h2>
              <ul className="space-y-2">
                {meeting.summaries.actionItems.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendees */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attendees</h2>
              <div className="space-y-3">
                {meeting.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-3">
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="min-w-0">
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
    </div>
  )
}
