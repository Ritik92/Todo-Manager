import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ $or: [{ username }, { email }] })
  if (existingUser) {
    return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const result = await db.collection("users").insertOne({
    username,
    email,
    password: hashedPassword,
  })

  return NextResponse.json({ id: result.insertedId }, { status: 201 })
}