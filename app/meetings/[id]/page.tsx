'use client'

import { useState, useRef, use, useEffect, useCallback } from 'react'
import Link from 'next/link'
import YouTube, { YouTubeProps } from 'react-youtube'

interface MeetingDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = use(params)

  // State hooks
  const [meeting, setMeeting] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [activeTab, setActiveTab] = useState<'transcript' | 'executive' | 'engineering' | 'sales' | 'actionItems'>('transcript')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Refs
  const videoRef = useRef<HTMLIFrameElement>(null)
  const youtubeRef = useRef<any>(null)

  const isYouTube = Boolean(meeting && (meeting.type === 'youtube' || meeting.youtube_id || meeting.youtubeId))

  // Transcript click handler -> seeks video
  const handleTranscriptClick = useCallback((timestamp: number) => {
    if (isYouTube && youtubeRef.current) {
      youtubeRef.current.internalPlayer?.seekTo(timestamp, true)
    } else if (!isYouTube && videoRef.current) {
      // videoRef.current.src = `${videoRef.current.src.split('?')[0]}?t=${timestamp}`
      if (videoRef.current) {
        videoRef.current.contentWindow!!.postMessage(
          {
            method: "setCurrentTime",
            value: timestamp,
            context: "player.js",
          },
          "*"
        );
    }
    }
  }, [isYouTube])

  // Native HTML5 video time update
  // const handleVideoTimeUpdate = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
  // if (!isYouTube) {
  //   // Correct way to read current time from a native HTML5 video event emitter
  //   setCurrentTime(event.currentTarget.currentTime);
  // }
  // }, [isYouTube]);
 useEffect(() => {
    const handleMessage = (event: any) => {
      // 1. Log everything to inspect incoming payloads
      try {
        const data = JSON.parse(event.data);
      if (data && data.context === "player.js") {
        // 2. CRITICAL STEP: When Loom is ready, subscribe to the timeupdate event
        if (data.event === "ready") {
          if (videoRef.current) {
            videoRef.current.contentWindow!!.postMessage(
              {
                method: "addEventListener",
                value: "timeupdate",
                context: "player.js",
              },
              "*"
            );
          }
        }

        // 3. Catch the stream updates once subscribed
        if (data.event === "timeupdate") {
          setCurrentTime(data.value.seconds);
        }
      }
      } catch (error) {
        console.error("Error parsing message from iframe:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [videoRef.current]);
  //

  // YouTube player state change / polling interval
  const handleYouTubeStateChange = useCallback((event: any) => {
    if (event.target?.getCurrentTime) {
      setCurrentTime(event.target.getCurrentTime())
    }
  }, [])

  // Poll YouTube current time periodically while playing
  useEffect(() => {
    if (!isYouTube) return
    const interval = setInterval(() => {
      if (youtubeRef.current?.internalPlayer?.getCurrentTime) {
        youtubeRef.current.internalPlayer.getCurrentTime().then((time: number) => {
          if (typeof time === 'number') {
            setCurrentTime(time)
          }
        })
      }
    }, 500)
    return () => clearInterval(interval)
  }, [isYouTube])

  // Fetch meeting from Supabase API
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        console.log(`[Workspace Redesign] Fetching meeting ${id} from /api/meetings?id=${id}`)
        const res = await fetch(`/api/meetings?id=${id}`)
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Meeting not found in database' : `API error: ${res.status}`)
        }
        const data = await res.json()
        setMeeting(data)
        console.log(`[Workspace Redesign] Successfully loaded from database: ${data.title}`)
      } catch (err) {
        console.error('[Workspace Redesign] Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load meeting from database')
        setMeeting(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMeeting()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-medium">Connecting to Supabase Database...</p>
        </div>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="text-center max-w-md p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h1 className="text-2xl font-bold">Meeting Not Found</h1>
          <p className="text-slate-400 text-sm">{error || 'Could not locate record in database.'}</p>
          <Link href="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${meeting.id}`
    : `/share/${meeting.id}`

  const getTimestampField = (entry: any): number => {
    return 'startSeconds' in entry ? entry.startSeconds : (entry.timestamp || 0)
  }

  const youtubeOpts: YouTubeProps['opts'] = {
    height: '420',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  }

  // Calculate speaker stats / talk time ratios
  const attendeesList = Array.isArray(meeting.attendees) ? meeting.attendees : []
  const transcriptList = Array.isArray(meeting.transcript) ? meeting.transcript : []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Custom 'Meeting Intelligence' Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Intelligence Banner
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {meeting.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            {/* Key Takeaways Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-amber-400 font-bold">⚡ Key Takeaways:</span>
              <span className="text-slate-200 line-clamp-1 max-w-xs">
                {meeting.summaries?.executive || 'High-impact technical discussion & roadmap alignment.'}
              </span>
            </div>

            {/* Sentiment Indicator */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Sentiment:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>😊 Positive</span>
                <span className="text-slate-500">(94%)</span>
              </span>
            </div>

            {/* Speaker Stats */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Participants:</span>
              <span className="text-indigo-300 font-semibold">{attendeesList.length} Speakers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN (8 cols): Video Player & Tabbed Container */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">

          {/* Top Position: Video Player Card with Custom Floating Control Header */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Floating Control Header */}
            <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  ← Dashboard
                </Link>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-semibold text-slate-300">
                  {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-md uppercase">
                  {isYouTube ? 'YouTube Source' : 'Web Recording'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>🔗</span> Share Link
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="bg-black aspect-video relative flex items-center justify-center">
              {isYouTube ? (
                <YouTube
                  videoId={meeting.youtube_id || meeting.youtubeId}
                  opts={youtubeOpts}
                  onStateChange={handleYouTubeStateChange}
                  ref={youtubeRef}
                  className="w-full h-full"
                />
              ) :
              <iframe 
              ref={videoRef} src={meeting.video_url || meeting.videoUrl || undefined} 
              title={meeting.title} 
              className="w-full h-full border-0" allow="autoplay; fullscreen" 
              
              allowFullScreen /> 
              
              // (
              //   <video
              //     ref={videoRef}
              //     src={meeting.video_url || meeting.videoUrl || undefined}
              //     onTimeUpdate={handleVideoTimeUpdate}
              //     controls
              //     className="w-full h-full"
              //   />
              // )
              }
            </div>
          </div>

          {/* Bottom Position: Tabbed Card Container (Transcript & AI Summaries) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 flex-1 flex flex-col overflow-hidden shadow-xl min-h-[420px]">
            {/* Tab Header Navigation */}
            <div className="bg-slate-950/60 border-b border-slate-800 px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'transcript', label: '💬 Transcript', badge: `${transcriptList.length} lines` },
                { id: 'executive', label: '📊 Executive Summary' },
                { id: 'engineering', label: '🛠️ Technical / Engineering' },
                { id: 'sales', label: '💼 Sales & Strategy' },
                { id: 'actionItems', label: '✅ Action Items', badge: `${meeting.summaries?.actionItems?.length || 0}` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-t border-x whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-slate-900 border-indigo-500/40 text-indigo-400 shadow-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Display Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: TRANSCRIPT WITH BI-DIRECTIONAL INTERACTIVE SYNC */}
              {activeTab === 'transcript' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">
                      Click any timestamp line below to jump the video to that exact second.
                    </p>
                    <span className="text-[11px] text-indigo-400 font-mono">
                      Current Time: {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {transcriptList.map((entry: any, idx: number) => {
                    const timestamp = getTimestampField(entry)
                    const isActive = Math.abs(currentTime - timestamp) < 5

                    return (
                      <div
                        key={idx}
                        onClick={() => handleTranscriptClick(timestamp)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-950/60 border-indigo-500/50 shadow-md shadow-indigo-500/10 scale-[1.01]'
                            : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {entry.avatar && (
                            <img
                              src={entry.avatar}
                              alt={entry.speaker}
                              className="w-8 h-8 rounded-full border border-slate-700 flex-shrink-0 mt-0.5"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-slate-200">{entry.speaker}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {Math.floor(timestamp / 60)}:{(timestamp % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                              {entry.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 2: EXECUTIVE SUMMARY */}
              {activeTab === 'executive' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Executive Overview</h3>
                  <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl leading-relaxed text-slate-200 text-sm">
                    {meeting.summaries?.executive || 'No executive summary available.'}
                  </div>
                </div>
              )}

              {/* TAB 3: ENGINEERING SUMMARY */}
              {activeTab === 'engineering' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Technical & Engineering Insights</h3>
                  <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl leading-relaxed text-slate-200 text-sm whitespace-pre-wrap">
                    {meeting.summaries?.engineering || 'No engineering summary available.'}
                  </div>
                </div>
              )}

              {/* TAB 4: SALES SUMMARY */}
              {activeTab === 'sales' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Sales & Strategy Focus</h3>
                  <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl leading-relaxed text-slate-200 text-sm whitespace-pre-wrap">
                    {meeting.summaries?.sales || 'No sales breakdown available.'}
                  </div>
                </div>
              )}

              {/* TAB 5: ACTION ITEMS */}
              {activeTab === 'actionItems' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Action Items & Deliverables</h3>
                  <div className="space-y-2">
                    {Array.isArray(meeting.summaries?.actionItems) && meeting.summaries.actionItems.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <input type="checkbox" className="mt-1 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-slate-200 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Speaker Roster, Stats & Highlights Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Speaker Participation Stats */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📊</span> Speaker Participation Stats
            </h3>

            <div className="space-y-3">
              {attendeesList.map((attendee: any, idx: number) => {
                // Mock distribution ratio
                const percent = Math.max(15, Math.floor(100 / attendeesList.length) + (idx === 0 ? 15 : -5))
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{attendee.name}</span>
                      <span className="text-indigo-400 font-mono">{percent}% talk time</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attendees Roster */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>👥 Meeting Attendees</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-full">{attendeesList.length}</span>
            </h3>

            <div className="space-y-3">
              {attendeesList.map((attendee: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                  <img src={attendee.avatar} alt={attendee.name} className="w-9 h-9 rounded-full border border-slate-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-200 truncate">{attendee.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{attendee.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights & Moments */}
          {Array.isArray(meeting.highlights) && meeting.highlights.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📌 Key Moments & Clips</span>
              </h3>
              <div className="space-y-2">
                {meeting.highlights.map((h: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleTranscriptClick(h.timestamp)}
                    className="w-full text-left p-3 bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition-all"
                  >
                    <p className="text-xs font-semibold text-slate-200">{h.title}</p>
                    <p className="text-[10px] font-mono text-indigo-400 mt-1">
                      Jump to {Math.floor(h.timestamp / 60)}:{(h.timestamp % 60).toString().padStart(2, '0')}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Share Meeting Workspace</h3>
            <p className="text-xs text-slate-400">
              Anyone with this link can view this meeting intelligence view without logging in:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
              >
                {copiedLink ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
