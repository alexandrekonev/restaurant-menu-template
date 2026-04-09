import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to /menu
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/menu', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|studio|menu|lunch|favicon).*)'],
}
