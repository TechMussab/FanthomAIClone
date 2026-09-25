import { NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'
import { meetings as mockMeetings, ytArchitectureMeeting } from '@/src/data/meetings'

export async function GET() {
  try {
    console.log('[Seed API] Starting database seed with original mock dataset...')

    const allMockData = [ytArchitectureMeeting, ...mockMeetings]

    const formattedMeetings = allMockData.map((m: any) => ({
      id: m.id,
      title: m.title,
      date: m.date,
      duration: typeof m.duration === 'string' ? m.duration : Number(m.duration),
      video_url: m.videoUrl || null,
      youtube_id: m.youtubeId || null,
      type: m.type || 'video',
      summaries: m.summaries,
      attendees: m.attendees,
      transcript: m.transcript,
      highlights: m.highlights || [],
    }))

    console.log(`[Seed API] Upserting ${formattedMeetings.length} meetings into Supabase...`)

    const { data, error } = await supabase
      .from('meetings')
      .upsert(formattedMeetings, { onConflict: 'id' })
      .select()

    if (error) {
      console.error('[Seed API] Error seeding database:', error)
      return NextResponse.json(
        { error: 'Failed to seed database', details: error },
        { status: 500 }
      )
    }

    console.log(`[Seed API] Successfully seeded ${data?.length || 0} meetings!`)
    return NextResponse.json({
      message: 'Database successfully seeded!',
      count: data?.length || 0,
      meetings: data,
    })
  } catch (err) {
    console.error('[Seed API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error during seeding', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
