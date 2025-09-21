import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ['/', '/login', '/register'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    const returnUrl = new URL('/login', request.url);
    returnUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(returnUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};