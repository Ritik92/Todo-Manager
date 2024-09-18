"use client"
import { Suspense } from 'react'
import TaskList from '@/app/components/Tasklist'
import { SessionProvider } from 'next-auth/react'

export default function TasksPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
      <TaskList />
      </SessionProvider>
       
      </Suspense>
    </div>
  )
}