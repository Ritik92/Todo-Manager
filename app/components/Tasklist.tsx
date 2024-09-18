'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import TaskForm from './TaskForm'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
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

  const handleTaskAdded = () => {
    setIsAddDialogOpen(false)
    fetchTasks()
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const handleTaskUpdated = () => {
    setIsEditDialogOpen(false)
    setEditingTask(null)
    fetchTasks()
  }

  const handleDeleteTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      fetchTasks()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
      <Table>
        <TableCaption>A list of your tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEditTask(task)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteTask(task._id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>
              Update the details of your task.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm onTaskAdded={handleTaskUpdated} initialData={editingTask} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}