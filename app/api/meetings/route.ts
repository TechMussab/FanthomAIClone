import { NextResponse } from 'next/server'
import { getMeetings, getMeetingById, createMeeting } from '@/src/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    console.log(`[API] GET /api/meetings ${id ? `?id=${id}` : ''}`)

    if (id) {
      // Fetch single meeting by ID
      console.log(`[DB] Querying meetings table for id: ${id}`)
      const meeting = await getMeetingById(id)

      if (!meeting) {
        console.log(`[DB] Meeting not found: ${id}`)
        return NextResponse.json(
          { error: 'Meeting not found' },
          { status: 404 }
        )
      }

      console.log(`[DB] Meeting found: ${meeting.title}`)
      return NextResponse.json(meeting)
    } else {
      // Fetch all meetings
      console.log('[DB] Querying all meetings from database')
      const meetings = await getMeetings()
      console.log(`[DB] Retrieved ${meetings.length} meetings from database`)
      return NextResponse.json(meetings)
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
    console.log('[API] POST /api/meetings - Creating new meeting')
    console.log('[DB] Inserting meeting into database:', body.title)

    const meeting = await createMeeting(body)

    if (!meeting) {
      console.error('[DB] Failed to create meeting')
      return NextResponse.json(
        { error: 'Failed to create meeting' },
        { status: 500 }
      )
    }

    console.log(`[DB] Meeting created successfully: ${meeting.id}`)
    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('[API] Error in POST /api/meetings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
