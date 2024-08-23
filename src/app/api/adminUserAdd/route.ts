import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.userCredentials.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

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
