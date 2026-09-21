import { ReactNode } from 'react'
import { cookies } from 'next/headers'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('fathom-user')

    if (!userCookie || !userCookie.value) {
      return null
    }

    const user = JSON.parse(userCookie.value)
    return user as AuthUser
  } catch {
    return null
  }
}

export async function setAuthUser(user: AuthUser) {
  try {
    const cookieStore = await cookies()
    cookieStore.set('fathom-user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch {
    // Cookies can only be set in Server Components
  }
}

export async function clearAuthUser() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('fathom-user')
  } catch {
    // Cookies can only be cleared in Server Components
  }
}
