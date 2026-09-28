import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthUser } from './lib/auth'

export async function middleware(request: NextRequest) {
  const user = await getAuthUser()
  const { pathname } = request.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/signup',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/share',
    '/shared',
  ]

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Special handling for shared meeting links
  if (pathname.startsWith('/meetings/') && request.nextUrl.searchParams.has('share')) {
    return NextResponse.next()
  }

  if (user) {
    // If authenticated, prevent access to login/signup pages
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to all other pages for authenticated users
    return NextResponse.next()
  } else {
    // If not authenticated and trying to access a protected path
    if (!isPublicPath) {
      const redirectTo = encodeURIComponent(pathname + request.nextUrl.search)
      return NextResponse.redirect(new URL(`/login?redirectTo=${redirectTo}`, request.url))
    }
    // Allow access to public paths for unauthenticated users
    return NextResponse.next()
  }
}

// Configuration for the middleware matcher
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/onboarding',
    '/meetings/:path*',
    '/settings',
    '/api/auth/:path*',
  ],
}
