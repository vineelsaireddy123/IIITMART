import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isset = request.cookies.get("token");

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }
  if (isset !== undefined &&( pathname === "/login" || pathname === "/signup")) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  if (isset === undefined && pathname !== "/login") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return response;
  }
  return NextResponse.next();
}
