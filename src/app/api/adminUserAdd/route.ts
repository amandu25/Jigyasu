import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma"; // Import the Prisma instance from your project

// Define salt rounds for hashing
const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if the username already exists
    const existingUser = await prisma.userCredentials.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert new user credentials
    await prisma.userCredentials.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User added successfully!" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
