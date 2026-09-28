'use server'

import { createUserRecord, getUserByEmail, saveOnboardingData } from '@/src/lib/supabase'
import { setAuthUser, clearAuthUser } from './auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const team_size = formData.get('team_size') as string | null
  const crm_selected = formData.get('crm_selected') as string | null

  // Basic validation
  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required')
  }

  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error('Email already in use')
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUserRecord = {
      email,
      password_hash: passwordHash,
      full_name: name,
      team_size: team_size || undefined,
      crm_selected: crm_selected || undefined,
    }

    const user = await createUserRecord(newUserRecord)
    if (!user) {
      throw new Error('Failed to create user record')
    }

    // Set session cookie
    await setAuthUser({ id: user.id, email: user.email, name: user.full_name })

    // If onboarding data exists, save it (from previous steps)
    // This part might need refinement based on how onboarding state is passed.
    // For now, assuming a default or skipping if not available.

  } catch (error) {
    console.error('Signup error:', error)
    throw new Error(error instanceof Error ? error.message : 'Signup failed')
  }

  redirect('/')
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Set session cookie
    await setAuthUser({ id: user.id, email: user.email, name: user.full_name })

  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }

  redirect('/')
}

export async function logoutAction() {
  await clearAuthUser()
  redirect('/login')
}
