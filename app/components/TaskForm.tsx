'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export default function TaskForm({ onTaskAdded, initialData }: { onTaskAdded: () => void, initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
    },
  })

  async function onSubmit(data: TaskFormValues) {
    setIsSubmitting(true)
    try {
      const url = initialData ? `/api/tasks/${initialData._id}` : '/api/tasks'
      const method = initialData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(initialData ? 'Failed to update task' : 'Failed to create task')
      }

      toast({
        title: initialData ? "Task updated" : "Task created",
        description: `Your task has been ${initialData ? 'updated' : 'created'} successfully.`,
      })

      form.reset()
      onTaskAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} task. Please try again.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Processing...' : initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </Form>
  )
}