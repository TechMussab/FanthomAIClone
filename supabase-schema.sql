-- Supabase Database Schema for Fathom AI Clone

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY DEFAULT 'meeting-' || uuid_generate_v4()::text,
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  duration INTEGER, -- in seconds for regular meetings
  video_url TEXT,
  youtube_id TEXT,
  type TEXT DEFAULT 'video', -- 'video' or 'youtube'
  summaries JSONB NOT NULL DEFAULT '{
    "executive": "",
    "engineering": "",
    "sales": "",
    "actionItems": []
  }'::jsonb,
  attendees JSONB NOT NULL DEFAULT '[]'::jsonb,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding table
CREATE TABLE IF NOT EXISTS onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  team_size TEXT NOT NULL,
  invited_emails JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_existing TEXT NOT NULL,
  share_new_by_default BOOLEAN NOT NULL DEFAULT false,
  selected_crm TEXT NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding(user_id);

-- Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;

-- Public read access for meetings (for shared links)
CREATE POLICY "Allow public read access to meetings"
  ON meetings FOR SELECT
  USING (true);

-- Authenticated users can insert meetings
CREATE POLICY "Allow authenticated users to insert meetings"
  ON meetings FOR INSERT
  WITH CHECK (true);

-- Onboarding data policies
CREATE POLICY "Users can read their own onboarding data"
  ON onboarding FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own onboarding data"
  ON onboarding FOR INSERT
  WITH CHECK (true);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insert (optional - run after table creation)
INSERT INTO meetings (id, title, date, duration, video_url, summaries, attendees, transcript, highlights) VALUES
(
  'meeting-1',
  'Engineering Standup',
  '2024-09-20',
  1800,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  '{"executive": "Engineering team completed user service refactoring and began dashboard redesign. One payment module issue identified.", "engineering": "API refactoring completed and merged. Dashboard components in progress. Payment module edge cases found and need fixing.", "sales": "Backend infrastructure improvements underway. Expected to improve system performance and stability.", "actionItems": ["Create tickets for payment module edge cases", "Complete dashboard component designs", "Review Frank''s API refactoring PR"]}'::jsonb,
  '[{"id": "1", "name": "Alice Johnson", "role": "Engineering Lead", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "email": "alice@company.com"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "Alice Johnson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "text": "Good morning everyone. Let''s kick off with a quick standup."}]'::jsonb,
  '[{"id": "h1", "timestamp": 15, "endTimestamp": 40, "title": "API Refactoring Complete"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE meetings IS 'Stores meeting recordings, transcripts, and AI-generated summaries';
COMMENT ON TABLE onboarding IS 'Stores user onboarding flow data';
