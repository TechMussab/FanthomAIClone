import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data fallback.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Meeting {
  id: string
  title: string
  date: string
  duration: number | string
  video_url?: string
  youtube_id?: string
  type?: 'youtube' | 'video'
  summaries: {
    executive: string
    engineering: string
    sales: string
    actionItems: string[]
  }
  attendees: Array<{
    id?: string
    name: string
    role: string
    avatar: string
    email?: string
  }>
  transcript: Array<{
    timestamp?: number
    startSeconds?: number
    speaker: string
    avatar: string
    text: string
  }>
  highlights?: Array<{
    id: string
    timestamp: number
    endTimestamp: number
    title: string
  }>
  created_at?: string
  updated_at?: string
}

export interface OnboardingData {
  id?: string
  user_id: string
  team_size: string
  invited_emails: string[]
  share_existing: string
  share_new_by_default: boolean
  selected_crm: string
  completed_at: string
  created_at?: string
}

// Helper functions for database operations
export async function getMeetings(): Promise<Meeting[]> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching meetings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching meeting:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function createMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>): Promise<Meeting | null> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert([meeting])
      .select()
      .single()

    if (error) {
      console.error('Error creating meeting:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function saveOnboardingData(data: OnboardingData): Promise<OnboardingData | null> {
  try {
    const { data: result, error } = await supabase
      .from('onboarding')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving onboarding data:', error)
      return null
    }

    return result
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export async function getOnboardingData(userId: string): Promise<OnboardingData | null> {
  try {
    const { data, error } = await supabase
      .from('onboarding')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching onboarding data:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}
