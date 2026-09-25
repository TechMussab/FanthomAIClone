'use server'

import { createUserRecord, getUserByEmail } from '@/src/lib/supabase'
import { setAuthUser, clearAuthUser } from './auth'
import { redirect } from 'next/navigation'

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    const user = await createUserRecord({
      email,
      password_hash: password,
      full_name: name,
    })
    if (!user) {
      throw new Error('Failed to create user record')
    }
    await setAuthUser({ id: user.id, email: user.email, name: user.full_name })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Signup failed')
  }

  redirect('/')
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const user = await getUserByEmail(email)
    if (!user || user.password_hash !== password) {
      throw new Error('Invalid email or password')
    }

    await setAuthUser({ id: user.id, email: user.email, name: user.full_name })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }

  redirect('/')
}

export async function logoutAction() {
  await clearAuthUser()
  redirect('/login')
}
