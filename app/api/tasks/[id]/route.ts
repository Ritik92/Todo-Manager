import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/app/lib/db"
import { ObjectId } from "mongodb"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  const userId = (session.user as any).id;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const updates = await req.json()

  const { db } = await connectToDatabase()
  const result = await db.collection("tasks").updateOne(
    { _id: new ObjectId(id), userId:userId},
    { $set: updates }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession()
  
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
  
    const { id } = params
    
  
    const { db } = await connectToDatabase()
    const result = await db.collection("tasks").deleteOne(
      { _id: new ObjectId(id) }
    
    )
  
    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }
  
    return NextResponse.json({ success: true })
  }
  export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions)
    const userId = (session.user as any).id;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    const { id } = params
    const data = await req.json()
  
    const { db } = await connectToDatabase()
  
    try {
      // Replace the whole document with the new data
      const result = await db.collection('tasks').replaceOne(
        { _id: new ObjectId(id), userId: session.user.id },
        {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          userId: userId,// Ensure this is part of the updated data
        }
      )
  
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error updating task:', error)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }
}