import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Import the Prisma instance from your project

export async function GET(req: NextRequest) {
  try {
    // Fetch all courses using Prisma
    const courses = await prisma.course.findMany();

    // Return the fetched courses as JSON
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
