import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

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

    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

      const response = NextResponse.json({ message: "Login successful" });
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
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
