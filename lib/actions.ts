'use server'

import { createUser, validateUser } from './db'
import { setAuthUser, clearAuthUser } from './auth'
import { redirect } from 'next/navigation'

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    const user = createUser(email, password, name)
    await setAuthUser({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Signup failed')
  }

  redirect('/')
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = validateUser(email, password)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  await setAuthUser({ id: user.id, email: user.email, name: user.name })
  redirect('/')
}

export async function logoutAction() {
  await clearAuthUser()
  redirect('/login')
}
