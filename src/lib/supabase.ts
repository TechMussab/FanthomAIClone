import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User interface
export interface UserRecord {
  id: string
  email: string
  password_hash: string
  full_name: string
  team_size?: string
  crm_selected?: string
  created_at?: string
}

// Meeting interface
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

// --- USER & AUTH DATABASE HELPERS ---

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (error) {
      console.error('[DB] Error fetching user by email:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('[DB] User query exception:', err)
    return null
  }
}

export async function createUserRecord(user: Omit<UserRecord, 'id' | 'created_at'>): Promise<UserRecord | null> {
  try {
    const newUser = {
      ...user,
      email: user.email.toLowerCase(),
    }

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error creating user record:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('[DB] User insert exception:', err)
    return null
  }
}

export async function updateUserOnboarding(userId: string, teamSize: string, crmSelected: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ team_size: teamSize, crm_selected: crmSelected })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('[DB] Error updating user onboarding info:', error)
    }
    return data
  } catch (err) {
    console.error('[DB] Update user exception:', err)
    return null
  }
}

// --- MEETINGS DATABASE HELPERS ---

export async function getMeetings(): Promise<Meeting[]> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[DB] Error fetching meetings:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('[DB] Database error:', error)
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
      console.error('[DB] Error fetching meeting:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('[DB] Database error:', error)
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
      console.error('[DB] Error creating meeting:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('[DB] Database error:', error)
    return null
  }
}

// --- ONBOARDING DATABASE HELPERS ---

export async function saveOnboardingData(data: OnboardingData): Promise<OnboardingData | null> {
  try {
    const { data: result, error } = await supabase
      .from('onboarding')
      .upsert([data], { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('[DB] Error saving onboarding data:', error)
      return null
    }
    return result
  } catch (error) {
    console.error('[DB] Database error:', error)
    return null
  }
}
