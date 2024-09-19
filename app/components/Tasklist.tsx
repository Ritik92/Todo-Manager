import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('dueDate')
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchTasks()
    }
  }, [session])

  useEffect(() => {
    filterAndSortTasks()
  }, [tasks, statusFilter, priorityFilter, sortBy])

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks')
    if (response.ok) {
      const data = await response.json()
      setTasks(data)
    }
  }

  const filterAndSortTasks = () => {
    let filtered = tasks.filter(task => 
      (statusFilter === 'all' || task.status === statusFilter) &&
      (priorityFilter === 'all' || task.priority === priorityFilter)
    )

    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 }
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
      }
      return 0
    })

    setFilteredTasks(filtered)
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
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Task List</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleEditTask(task)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">Delete</Button>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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