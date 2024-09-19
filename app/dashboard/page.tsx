'use client';

import React from 'react';
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Task Management Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-sm sm:text-base text-gray-600 font-medium">Welcome, {session?.user?.name || 'User'}!</span>
            <Button onClick={handleSignOut} variant="outline" className="w-full sm:w-auto">Logout</Button>
            <Avatar>
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {session?.user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <nav className="mb-8">
          <Card>
            <CardContent className="p-2">
              <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <li className="w-full sm:w-auto">
                  <Link href="/dashboard/tasks" passHref>
                    <Button variant="ghost" className="w-full sm:w-auto">Task List</Button>
                  </Link>
                </li>
                <li className="w-full sm:w-auto">
                  <Link href="/dashboard/kanban" passHref>
                    <Button variant="ghost" className="w-full sm:w-auto">Kanban Board</Button>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </nav>

        <main>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Quick Overview</h2>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Task List</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      View and manage your tasks in a list format. Perfect for quick updates and detailed task information.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Kanban Board</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Visualize your workflow with our Kanban board. Drag and drop tasks to update their status effortlessly.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}