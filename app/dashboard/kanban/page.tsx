"use client"
import { Suspense } from 'react'
import KanbanBoard from '@/app/components/Kanbanboard'
import { SessionProvider } from 'next-auth/react'

export default function KanbanPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
      <KanbanBoard />
      </SessionProvider>
  
      </Suspense>
    </div>
  )
}