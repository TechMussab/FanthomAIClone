import { NextResponse } from 'next/server'
import { supabase, getMeetings, getMeetingById, createMeeting } from '@/src/lib/supabase'
import { meetings as mockMeetings, ytArchitectureMeeting } from '@/src/data/meetings'

async function autoSeedDatabase() {
  console.log('[DB Auto-Seed] Database is empty. Seeding with original mock data...')
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

  const { data, error } = await supabase
    .from('meetings')
    .upsert(formattedMeetings, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('[DB Auto-Seed] Failed:', error)
    return []
  }

  console.log(`[DB Auto-Seed] Successfully inserted ${data?.length || 0} meetings into Supabase!`)
  return data || []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    console.log(`[API] GET /api/meetings ${id ? `?id=${id}` : ''}`)

    if (id) {
      console.log(`[DB] Querying meetings table for id: ${id}`)
      let meeting = await getMeetingById(id)

      if (!meeting) {
        console.log(`[DB] Meeting ${id} not found. Running auto-seed check...`)
        const seeded = await autoSeedDatabase()
        meeting = seeded.find((m: any) => m.id === id) || null
      }

      if (!meeting) {
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(meeting)
    } else {
      console.log('[DB] Querying all meetings from Supabase...')
      let meetingsList = await getMeetings()

      if (!meetingsList || meetingsList.length === 0) {
        console.log('[DB] 0 meetings returned. Triggering auto-seed...')
        meetingsList = await autoSeedDatabase()
      }

      console.log(`[DB] Returning ${meetingsList.length} meetings`)
      return NextResponse.json(meetingsList)
    }
  } catch (error) {
    console.error('[API] Error in GET /api/meetings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[API] POST /api/meetings - Inserting meeting into Supabase')
    const meeting = await createMeeting(body)

    if (!meeting) {
      return NextResponse.json(
        { error: 'Failed to create meeting' },
        { status: 500 }
      )
    }

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('[API] Error in POST /api/meetings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
