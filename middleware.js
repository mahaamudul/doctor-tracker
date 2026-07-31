import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith('/login');
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/doctors') ||
    pathname.startsWith('/patients');

  // 1. Root route '/' handling: redirect to /dashboard if logged in, otherwise /login
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 2. If trying to access protected routes without a valid session token, redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If already logged in and trying to access /login, redirect to /dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/doctors',
    '/doctors/:path*',
    '/patients',
    '/patients/:path*',
    '/login',
  ],
};