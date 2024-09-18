'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import TaskForm from './TaskForm'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchTasks()
    }
  }, [session])

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks')
    if (response.ok) {
      const data = await response.json()
      setTasks(data)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId
      const newStatus = destination.droppableId

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        )
      }
    }
  }

  const handleTaskAdded = () => {
    setIsDialogOpen(false)
    fetchTasks()
  }

  const columns = ['To Do', 'In Progress', 'Completed']

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new task</DialogTitle>
              <DialogDescription>
                Fill in the details for your new task.
              </DialogDescription>
            </DialogHeader>
            <TaskForm onTaskAdded={handleTaskAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {columns.map(column => (
            <div key={column} className="w-1/3">
              <h3 className="font-bold mb-2">{column}</h3>
              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-4 rounded min-h-[500px]"
                  >
                    {tasks
                      .filter(task => task.status === column)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card className="mb-4">
                                <CardHeader>
                                  <CardTitle>{task.title}</CardTitle>
                                  <CardDescription>{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <Badge>{task.priority}</Badge>
                                  <div></div>
                                  <Badge>{task.status}</Badge>
                                  <p className="mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}