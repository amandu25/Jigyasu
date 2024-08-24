import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jigyasuToken";

export function middleware(req: NextRequest) {
  console.log("Middleware executed");

  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;

  if (!token) {
    console.log("No token found, redirecting to login");

    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    console.log("Token is valid, allowing access");

    return NextResponse.next();
  } catch (error) {
    console.log("Invalid token, redirecting to login");

    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/productList/:path*"],
};
