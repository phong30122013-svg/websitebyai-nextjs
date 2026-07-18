import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit } from '@/lib/rate-limit'

// Pages that require a signed-in user.
const PROTECTED_PAGES = ['/snippets/new', '/projects/new', '/marketplace/new', '/blog/new']

// Auth endpoints get a tight limit — this is the main brute-force surface
// (credential stuffing against /api/auth/callback/credentials, account
// enumeration against /api/register).
const AUTH_ROUTES = ['/api/register', '/api/auth/callback/credentials', '/api/auth/signin']
const AUTH_LIMIT = 10
const AUTH_WINDOW_SECONDS = 60

// Server Actions (identified by the Next-Action header) are how every
// "create new ..." form submits. A looser limit here stops a script from
// hammering the database with repeated snippet/project/post/product writes.
const ACTION_LIMIT = 20
const ACTION_WINDOW_SECONDS = 60

function getClientIp(req: NextRequest) {
  return (
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

function tooManyRequests(retryAfter: number) {
  return new NextResponse(
    JSON.stringify({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.max(1, retryAfter)),
      },
    }
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getClientIp(req)

  // 1. Rate limit sensitive auth endpoints (brute-force / credential stuffing).
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const result = await rateLimit(`auth:${ip}:${pathname}`, AUTH_LIMIT, AUTH_WINDOW_SECONDS)
    if (!result.success) return tooManyRequests(result.retryAfter)
  }

  // 2. Rate limit Server Action writes (spam / DB-flooding protection).
  if (req.method === 'POST' && req.headers.get('next-action')) {
    const result = await rateLimit(`action:${ip}`, ACTION_LIMIT, ACTION_WINDOW_SECONDS)
    if (!result.success) return tooManyRequests(result.retryAfter)
  }

  // 3. Require a session for the "create new ..." pages.
  if (PROTECTED_PAGES.some((page) => pathname.startsWith(page))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/snippets/new',
    '/projects/new',
    '/marketplace/new',
    '/blog/new',
    '/api/register',
    '/api/auth/:path*',
  ],
}
