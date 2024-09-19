import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
  
  // If no session token is found, redirect to login page
  if (!sessionToken) {
    return NextResponse.rewrite(new URL('/auth/login', request.url));
  }

  return NextResponse.next(); // Continue if session token exists
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/tasks/:path*'],
};
