import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/app/lib/db"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session.user as any).id;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { db } = await connectToDatabase()
  const tasks = await db.collection("tasks").find({ userId:userId}).toArray()
  console.log(userId)
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id;
  const { title, description, status, priority, dueDate } = await req.json()

  const { db } = await connectToDatabase()
  const result = await db.collection("tasks").insertOne({
    title,
    description,
    status,
    priority,
    dueDate,
    userId:userId,
  })

  return NextResponse.json({ id: result.insertedId }, { status: 201 })
}