import { NextResponse } from 'next/server'
import { clearAuthUser } from '@/lib/auth'

export async function POST() {
  await clearAuthUser()
  return NextResponse.json({ message: 'Logged out' }, { status: 200 })
}
