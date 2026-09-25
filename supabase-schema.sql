-- Supabase Database Schema & Seed Data for Fathom AI Clone

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  duration INTEGER,
  video_url TEXT,
  youtube_id TEXT,
  type TEXT DEFAULT 'video',
  summaries JSONB NOT NULL DEFAULT '{}'::jsonb,
  attendees JSONB NOT NULL DEFAULT '[]'::jsonb,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create onboarding table
CREATE TABLE IF NOT EXISTS onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  team_size TEXT NOT NULL,
  invited_emails JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_existing TEXT NOT NULL,
  share_new_by_default BOOLEAN NOT NULL DEFAULT false,
  selected_crm TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes for speed
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;

-- 5. Policies for public access (anon key)
DROP POLICY IF EXISTS "Allow public read access to meetings" ON meetings;
CREATE POLICY "Allow public read access to meetings" ON meetings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to meetings" ON meetings;
CREATE POLICY "Allow public insert to meetings" ON meetings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to meetings" ON meetings;
CREATE POLICY "Allow public update to meetings" ON meetings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public access to onboarding" ON onboarding;
CREATE POLICY "Allow public access to onboarding" ON onboarding FOR ALL USING (true);

-- 6. Insert All 6 Seed Meetings (YouTube + 5 Mock Calls)
INSERT INTO meetings (id, title, date, duration, video_url, youtube_id, type, summaries, attendees, transcript, highlights) VALUES
(
  'meeting-mvvm-vs-mvi',
  'Android Architecture Review: MVVM vs MVI Pattern Analysis',
  '2026-09-21T10:00:00Z',
  1840,
  NULL,
  'b2z1jvD4VMQ',
  'youtube',
  '{"executive": "Detailed architectural breakdown comparing MVVM and MVI presentational patterns. Highlighted how MVI improves readability via single immutable UI state wrappers and Intent sealed interfaces.", "engineering": "1. Presentation Layer Scope: MVVM/MVI only manage UI/ViewModel presentation, not clean architecture domain/data layers.\n2. State Management: MVVM uses multiple StateFlows; MVI uses a unified UIState copy data class.\n3. User Actions: MVI encapsulates UI interactions inside an `onAction` sealed interface.", "actionItems": ["Standardize UI state wrapper pattern across Jetpack Compose screens", "Evaluate migration of multi-state flows to MVI single state representations"]}'::jsonb,
  '[{"id": "8", "name": "Philipp Lackner", "role": "Lead Mobile Architect", "avatar": "https://i.pravatar.cc/150?u=philipp"}]'::jsonb,
  '[{"id": "t1", "startSeconds": 0, "speaker": "Philipp Lackner", "text": "Welcome back! Today we are comparing MVVM vs MVI in Android native development once and for all."}, {"id": "t2", "startSeconds": 92, "speaker": "Philipp Lackner", "text": "Both MVVM (Model-View-ViewModel) and MVI (Model-View-Intent) are presentational patterns meant to separate your presentation layer."}, {"id": "t3", "startSeconds": 140, "speaker": "Philipp Lackner", "text": "In both patterns, the Model implements project-wide business rules and logic, like Data Classes in Kotlin."}, {"id": "t4", "startSeconds": 281, "speaker": "Philipp Lackner", "text": "The View refers strictly to the UI layer—whether XML layouts, View classes, or Jetpack Compose composables."}, {"id": "t5", "startSeconds": 304, "speaker": "Philipp Lackner", "text": "The ViewModel contains state mapping logic and processes incoming UI actions to update state."}, {"id": "t6", "startSeconds": 367, "speaker": "Philipp Lackner", "text": "In MVVM, each UI state property is exposed as an individual State flow or reference."}, {"id": "t7", "startSeconds": 484, "speaker": "Philipp Lackner", "text": "In MVI, all screen states are bundled into a single immutable UI State wrapper class with an Intent/Action sealed interface."}, {"id": "t8", "startSeconds": 965, "speaker": "Philipp Lackner", "text": "MVI gives better readability because you can inspect the full state class in 5 lines of code."}]'::jsonb,
  '[]'::jsonb
),
(
  'meeting-1',
  'Engineering Standup',
  '2024-09-20',
  1800,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  NULL,
  'video',
  '{"executive": "Engineering team completed user service refactoring and began dashboard redesign. One payment module issue identified.", "engineering": "API refactoring completed and merged. Dashboard components in progress. Payment module edge cases found and need fixing.", "sales": "Backend infrastructure improvements underway. Expected to improve system performance and stability.", "actionItems": ["Create tickets for payment module edge cases", "Complete dashboard component designs", "Review Frank''s API refactoring PR"]}'::jsonb,
  '[{"id": "1", "name": "Alice Johnson", "role": "Engineering Lead", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "email": "alice@company.com"}, {"id": "5", "name": "Emma Brown", "role": "QA Engineer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", "email": "emma@company.com"}, {"id": "6", "name": "Frank Miller", "role": "Backend Developer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank", "email": "frank@company.com"}, {"id": "7", "name": "Grace Lee", "role": "Frontend Developer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace", "email": "grace@company.com"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "Alice Johnson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "text": "Good morning everyone. Let''s kick off with a quick standup. Frank, what did you work on yesterday?"}, {"timestamp": 15, "speaker": "Frank Miller", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank", "text": "I finished the API refactoring for the user service. All tests are passing and it''s ready for code review."}, {"timestamp": 40, "speaker": "Grace Lee", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace", "text": "I started working on the new dashboard components. I''ll have the first version ready by end of day."}, {"timestamp": 65, "speaker": "Emma Brown", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", "text": "I''ve been running integration tests on the payment module. Found a couple of edge cases we need to fix."}, {"timestamp": 90, "speaker": "Alice Johnson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "text": "Great work everyone. Emma, can you create tickets for those edge cases? Let''s prioritize them for this sprint."}]'::jsonb,
  '[{"id": "h1", "timestamp": 15, "endTimestamp": 40, "title": "API Refactoring Complete"}]'::jsonb
),
(
  'meeting-2',
  'Design Review',
  '2024-09-19',
  2700,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  NULL,
  'video',
  '{"executive": "Dashboard redesign approved. Launch planned for two weeks with dark mode support.", "engineering": "Dashboard redesign approved. Grace to implement with dark mode as top priority.", "sales": "Improved user interface will enhance customer experience and reduce support tickets.", "actionItems": ["Implement dashboard redesign", "Add dark mode support", "Schedule QA testing"]}'::jsonb,
  '[{"id": "3", "name": "Carol Davis", "role": "Designer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", "email": "carol@company.com"}, {"id": "2", "name": "Bob Smith", "role": "Product Manager", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", "email": "bob@company.com"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "Carol Davis", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", "text": "Thanks everyone for joining. Today we''re reviewing the new dashboard mockups."}, {"timestamp": 60, "speaker": "Bob Smith", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", "text": "This looks great. The new layout is much more intuitive. Can we add dark mode support?"}]'::jsonb,
  '[{"id": "h2", "timestamp": 60, "endTimestamp": 90, "title": "Dark Mode Decision"}]'::jsonb
),
(
  'meeting-3',
  'Sales Discovery Call',
  '2024-09-18',
  1200,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  NULL,
  'video',
  '{"executive": "Prospect identified need for communication platform scaling and AI-powered analytics.", "engineering": "Prospect needs analytics infrastructure and AI integration capabilities.", "sales": "Strong fit for our platform. Next step: product demo scheduled.", "actionItems": ["Send product demo link", "Schedule follow-up call", "Prepare custom use case analysis"]}'::jsonb,
  '[{"id": "4", "name": "David Wilson", "role": "Sales Lead", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David", "email": "david@company.com"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "David Wilson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David", "text": "Welcome to our discovery call. I''d like to understand your key business challenges."}]'::jsonb,
  '[{"id": "h3", "timestamp": 90, "endTimestamp": 135, "title": "AI Insights Requirement Identified"}]'::jsonb
),
(
  'meeting-4',
  'Product Planning Session',
  '2024-09-17',
  2400,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  NULL,
  'video',
  '{"executive": "Q4 roadmap set: API improvements, dashboard redesign, reporting, and compliance features.", "engineering": "Q4 roadmap: 3 sprints for API and security, dashboard redesign, 3 sprints for compliance.", "sales": "Reporting and compliance features approved for Q4 to address client requests.", "actionItems": ["Schedule security audit", "Create compliance feature spec", "Plan sprint allocation"]}'::jsonb,
  '[{"id": "2", "name": "Bob Smith", "role": "Product Manager", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", "email": "bob@company.com"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "Bob Smith", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", "text": "Let''s review Q4 roadmap priorities."}]'::jsonb,
  '[]'::jsonb
),
(
  'meeting-5',
  'All-Hands Sprint Review',
  '2024-09-16',
  3600,
  'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
  NULL,
  'video',
  '{"executive": "8-person team delivered exceptional sprint: API refactoring complete, 3 enterprise deals ($500k ARR), 98% test coverage, 35% latency improvement.", "engineering": "All planned features shipped except one. API latency reduced 35%, 98% test coverage achieved.", "sales": "3 new enterprise deals closed totaling $500k ARR. Strong Q4 pipeline.", "actionItems": ["Coordinate external security audit", "Plan accessibility improvement sprints", "Complete dashboard redesign"]}'::jsonb,
  '[{"id": "8", "name": "Henry Chen", "role": "CEO", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry", "email": "henry@company.com"}, {"id": "1", "name": "Alice Johnson", "role": "Engineering Lead", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"}, {"id": "2", "name": "Bob Smith", "role": "Product Manager", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}, {"id": "3", "name": "Carol Davis", "role": "Designer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol"}, {"id": "4", "name": "David Wilson", "role": "Sales Lead", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David"}, {"id": "5", "name": "Emma Brown", "role": "QA Engineer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"}, {"id": "6", "name": "Frank Miller", "role": "Backend Developer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank"}, {"id": "7", "name": "Grace Lee", "role": "Frontend Developer", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"}]'::jsonb,
  '[{"timestamp": 0, "speaker": "Henry Chen", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry", "text": "Welcome everyone to our all-hands sprint review. This has been an exceptional sprint."}, {"timestamp": 45, "speaker": "Alice Johnson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", "text": "Engineering shipped the API refactoring and completed 8 of 9 planned features."}, {"timestamp": 180, "speaker": "David Wilson", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David", "text": "Sales closed 3 new enterprise deals totaling $500k ARR."}]'::jsonb,
  '[{"id": "h5", "timestamp": 300, "endTimestamp": 360, "title": "98% Test Coverage Achievement"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summaries = EXCLUDED.summaries,
  attendees = EXCLUDED.attendees,
  transcript = EXCLUDED.transcript;
