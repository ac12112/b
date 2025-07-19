import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isModerator = token?.role === "MODERATOR";
    const isUser = token?.role === "USER";

    // Admin/Moderator dashboard access
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!isAdmin && !isModerator) {
        return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/dashboard", req.url));
      }
    }

    // User dashboard access
    if (req.nextUrl.pathname.startsWith("/user-dashboard")) {
      if (!isUser) {
        return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/user-dashboard", req.url));
      }
    }

    // Protect submit-report route
    if (req.nextUrl.pathname.startsWith("/submit-report")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/submit-report", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/user-dashboard/:path*", "/submit-report/:path*"],
};