import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Secret key for JWT (store this securely, e.g., environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "jigyasuToken";

export function middleware(req: NextRequest) {
  console.log("Middleware executed");

  // Get the auth token from cookies
  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;

  if (!token) {
    console.log("No token found, redirecting to login");
    // If no token is found, redirect to the login page
    return NextResponse.redirect("/login");
  }

  try {
    // Verify the token
    jwt.verify(token, JWT_SECRET);
    console.log("Token is valid, allowing access");
    // If the token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.log("Invalid token, redirecting to login");
    // If the token is invalid, redirect to the login page
    return NextResponse.redirect("/login");
  }
}

// Specify the routes to apply the middleware to
export const config = {
  matcher: [
    // Apply middleware to all routes except the login page
    "/((?!login).*)",
  ],
};
