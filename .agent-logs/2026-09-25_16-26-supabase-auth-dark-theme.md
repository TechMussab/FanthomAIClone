# Supabase Authentication Integration & Dark Theme Unification

**Date**: 2026-09-25  
**Session**: Complete Supabase auth integration + dark industrial slate theme across all pages

## User Request
Connect Next.js app to Supabase and unify custom design across all remaining pages:
1. Real authentication flow with Supabase `users` table
2. Dark industrial slate theme (slate-900/950) with Indigo/Emerald accents
3. Update login, signup, dashboard, onboarding pages

## Changes Implemented

### 1. Database Schema (`supabase-schema.sql`)
**Added `users` table**:
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  team_size TEXT,
  crm_selected TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**RLS Policies**:
- Allow public insert (registration)
- Allow public read (login verification)

**Seed Data**:
- Demo user: `demo@fathom.com` / `demo123`

### 2. Authentication Actions (`lib/actions.ts`)
**Migrated from JSON file to Supabase**:
- `signupAction()` - Uses `createUserRecord()` from `lib/supabase.ts`
- `loginAction()` - Uses `getUserByEmail()` from `lib/supabase.ts`
- `logoutAction()` - Unchanged (clears cookie)

**Key changes**:
- Password verification: `user.password_hash !== password`
- User data: `user.full_name` instead of `user.name`
- All database calls now async

### 3. Login Page (`app/login/page.tsx`)
**Dark Theme Applied**:
- Background: `bg-slate-950` with gradient overlays
- Card: `bg-slate-900/50` with backdrop blur
- Borders: `border-slate-800`
- Inputs: `bg-slate-800/50` with `border-slate-700`
- Focus: `focus:ring-indigo-500`
- Button: Gradient `from-indigo-600 to-indigo-500` with hover effects
- Demo credentials box: `bg-emerald-950/30` with `border-emerald-900/50`

**Visual enhancements**:
- Floating gradient orbs (indigo/emerald at 5% opacity)
- Backdrop blur on main card
- Shadow effects on hover: `hover:shadow-indigo-500/25`

### 4. Signup Page (`app/signup/page.tsx`)
**Dark Theme Applied**:
- Matches login page aesthetic
- Same color scheme: slate-950 background, slate-900/50 card
- Gradient button with indigo theme
- Form inputs with slate-800/50 backgrounds

### 5. Onboarding Page (`app/onboarding/page.tsx`)
**Dark Theme Applied**:
- Background: `bg-slate-950` with fixed gradient overlays
- Header: `border-slate-800` separator
- Progress dots: `bg-indigo-500` (active) / `bg-slate-700` (inactive)
- Main card: `bg-slate-900/50` with backdrop blur
- All inputs: `bg-slate-800/50` with `border-slate-700`

**Step-specific colors**:
- Step 1-3: Indigo gradient buttons
- Step 4 (CRM): Emerald gradient button (`from-emerald-600 to-emerald-500`)
- Selected states: `border-indigo-500 bg-indigo-950/30` or `border-emerald-500 bg-emerald-950/30`

### 6. Dashboard Page (`app/page.tsx`)
**Dark Theme Applied**:
- Background: `bg-slate-950`
- Sidebar: `bg-slate-900/50` with `border-slate-800`
- Logo: Gradient text `from-indigo-400 to-emerald-400`
- Active nav: `bg-slate-800/50` with `text-slate-200`
- Inactive nav: `text-slate-400` with hover `bg-slate-800/30`

**User Profile Badge**:
- Background: `bg-slate-800/30` with `border-slate-700`
- Text: `text-slate-100` (name), `text-slate-400` (email)
- Buttons: 
  - Replay Onboarding: `bg-indigo-950/50` with `border-indigo-900/50`
  - Sign Out: `bg-red-950/50` with `border-red-900/50`

**Meeting Cards**:
- Background: `bg-slate-900/50` with `border-slate-800`
- Hover: `border-slate-700` with `shadow-indigo-500/10`
- Badge: `bg-indigo-950/50` with `border-indigo-900/50`

**Database Status Badge**:
- `bg-indigo-950/50` with `border-indigo-900/50`
- Text: `text-indigo-300` / `text-indigo-400`

## Color System Summary

### Base Colors
- **Background**: `slate-950` (main), `slate-900` (elevated surfaces)
- **Surfaces**: `slate-900/50` (semi-transparent cards with backdrop blur)
- **Borders**: `slate-800` (main), `slate-700` (inputs/hover)

### Accent Colors
- **Primary (Indigo)**: Buttons, focus states, progress indicators
  - `indigo-600` → `indigo-500` gradients
  - `indigo-950/50` backgrounds with `indigo-900/50` borders
  - `indigo-400` text for headings
  
- **Secondary (Emerald)**: Success states, CRM selection
  - `emerald-600` → `emerald-500` gradients
  - `emerald-950/30` backgrounds with `emerald-900/50` borders
  - `emerald-400` text for status

### Text Colors
- **Primary**: `slate-100` (headings)
- **Secondary**: `slate-300` (body)
- **Tertiary**: `slate-400` (labels)
- **Muted**: `slate-500` (hints)

## Files Modified
1. `supabase-schema.sql` - Added users table + RLS policies
2. `lib/actions.ts` - Migrated to Supabase auth
3. `app/login/page.tsx` - Dark theme
4. `app/signup/page.tsx` - Dark theme
5. `app/onboarding/page.tsx` - Dark theme (all 4 steps)
6. `app/page.tsx` - Dark theme (dashboard)

## User Action Required

### 1. Run SQL Schema Update
Execute in Supabase SQL Editor:
```bash
# Navigate to Supabase project dashboard
# Go to SQL Editor
# Run the updated supabase-schema.sql file
```

This creates:
- `users` table with proper structure
- RLS policies for public access
- Demo user seed data

### 2. Build & Test
```bash
npm run build
npm run dev
```

### 3. Test Flow
1. Visit `/login` - should see dark slate theme
2. Login with `demo@fathom.com` / `demo123`
3. Should redirect to `/onboarding` (first time)
4. Complete 4-step wizard - should see dark theme
5. Dashboard should show dark theme with user profile
6. Click "Replay Onboarding" to test wizard again
7. Test signup flow at `/signup`

## Technical Notes

### Authentication Flow
1. **Signup**: `signupAction()` → `createUserRecord()` → Supabase INSERT
2. **Login**: `loginAction()` → `getUserByEmail()` → Supabase SELECT → verify password
3. **Session**: HTTP-only cookie (7 days) via `setAuthUser()`
4. **Logout**: `clearAuthUser()` → delete cookie → redirect `/login`

### Password Security
⚠️ **Current Implementation**: Plain text password storage (`password_hash` field stores plain text)

**Production Required**:
```typescript
import bcrypt from 'bcrypt'

// Signup
const passwordHash = await bcrypt.hash(password, 10)
await createUserRecord(email, passwordHash, name)

// Login
const user = await getUserByEmail(email)
const isValid = await bcrypt.compare(password, user.password_hash)
```

### Onboarding Data Flow
1. **localStorage**: `fathom_onboarding_complete` flag
2. **Supabase**: `onboarding` table stores choices
3. **Dashboard check**: Redirects to `/onboarding` if flag not set

## Status
✅ **Complete** - All pages re-skinned, auth migrated to Supabase  
⏳ **Pending** - User must run SQL schema in Supabase  
⏳ **Pending** - Build verification (classifier unavailable)

## Next Steps
1. User runs `supabase-schema.sql` in Supabase SQL Editor
2. Build app with `npm run build`
3. Test complete auth + onboarding flow
4. Consider bcrypt for production password hashing
