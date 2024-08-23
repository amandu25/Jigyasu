import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma"; // Import the Prisma instance from your project
import jwt from "jsonwebtoken"; // Import jsonwebtoken

// Define salt rounds for hashing (if needed elsewhere)
const SALT_ROUNDS = 10;

// Secret key for JWT (store this securely, e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "jigyasuToken";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      console.log("Error: Missing username or password");
      return NextResponse.json(
        { message: "Missing username or password" },
        { status: 400 }
      );
    }

    console.log("Received POST request with:", { username, password });

    // Fetch the user with the provided username using Prisma
    const user = await prisma.userCredentials.findUnique({
      where: { username },
      select: { password: true },
    });

    console.log("Database query executed. Result:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const storedHashedPassword = user.password;

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

      // Set the token in cookies
      const response = NextResponse.json({ message: "Login successful" });
      response.cookies.set("authToken", token, {
        httpOnly: true, // Ensures the cookie is only accessible by the web server
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
