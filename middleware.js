// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Jika tidak login dan mengakses /game atau /admin, redirect ke /login
  if (!session && (req.nextUrl.pathname.startsWith('/game') || req.nextUrl.pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return res;
}

export const config = {
  matcher: ['/game/:path*', '/admin/:path*'],
};