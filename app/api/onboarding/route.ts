import { NextResponse } from 'next/server'
import { saveOnboardingData, getOnboardingData } from '@/src/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  try {
    if (!userId) {
      console.log('[API] GET /api/onboarding - Missing user_id parameter')
      return NextResponse.json(
        { error: 'user_id parameter required' },
        { status: 400 }
      )
    }

    console.log(`[API] GET /api/onboarding?user_id=${userId}`)
    console.log(`[DB] Querying onboarding table for user: ${userId}`)

    const data = await getOnboardingData(userId)

    if (!data) {
      console.log(`[DB] No onboarding data found for user: ${userId}`)
      return NextResponse.json(
        { error: 'Onboarding data not found' },
        { status: 404 }
      )
    }

    console.log(`[DB] Onboarding data retrieved for user: ${userId}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error in GET /api/onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[API] POST /api/onboarding - Saving onboarding data')
    console.log(`[DB] Inserting onboarding data for user: ${body.user_id}`)
    console.log('[DB] Data:', {
      team_size: body.team_size,
      share_existing: body.share_existing,
      share_new_by_default: body.share_new_by_default,
      selected_crm: body.selected_crm,
      invited_emails_count: body.invited_emails?.length || 0,
    })

    const onboardingData = {
      user_id: body.user_id,
      team_size: body.team_size,
      invited_emails: body.invited_emails || [],
      share_existing: body.share_existing,
      share_new_by_default: body.share_new_by_default,
      selected_crm: body.selected_crm,
      completed_at: new Date().toISOString(),
    }

    const data = await saveOnboardingData(onboardingData)

    if (!data) {
      console.error('[DB] Failed to save onboarding data')
      return NextResponse.json(
        { error: 'Failed to save onboarding data' },
        { status: 500 }
      )
    }

    console.log(`[DB] Onboarding data saved successfully for user: ${body.user_id}`)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[API] Error in POST /api/onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
