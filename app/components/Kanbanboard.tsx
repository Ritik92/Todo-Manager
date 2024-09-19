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
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Kanban Board</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {columns.map(column => (
            <div key={column} className="w-full sm:w-1/3">
              <h3 className="font-bold mb-2">{column}</h3>
              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-4 rounded min-h-[200px] sm:min-h-[500px]"
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
                                  <CardTitle className="text-sm sm:text-base">{task.title}</CardTitle>
                                  <CardDescription className="text-xs sm:text-sm">{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge className="text-xs">{task.priority}</Badge>
                                    <Badge className="text-xs">{task.status}</Badge>
                                  </div>
                                  <p className="mt-2 text-xs sm:text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
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