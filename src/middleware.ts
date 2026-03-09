import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && !isAuthPage;
  const hasSession = request.cookies.has('admin_session');

  if (isAdminPage && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
