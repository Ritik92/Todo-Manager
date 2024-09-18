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

//   if (!session) {
//     router.push("/auth/login");
//     return null; // or a loading spinner
//   }

  const handleSignOut = async () => {
   await  signOut();
   window.location.href='/auth/login'
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Welcome, {session?.user?.name}!</span>
            <Button onClick={handleSignOut}>Logout</Button>
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
              <AvatarFallback className="bg-blue-500 text-white">
                {session?.user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <nav className="mb-12">
          <Card className="bg-white/50 backdrop-blur-sm shadow-md">
            <CardContent className="p-2">
              <ul className="flex space-x-2">
                <li>
                  <Link href="/dashboard/tasks" passHref>
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-colors duration-200">
                      Task List
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/kanban" passHref>
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-colors duration-200">
                      Kanban Board
                    </Button>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </nav>
        <main>
          <Card className="bg-white/70 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-100 rounded-lg p-4 shadow-inner">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Task List</h3>
                  <p className="text-blue-600">
                    View and manage your tasks in a list format. Perfect for quick updates and detailed task information.
                  </p>
                </div>
                <div className="bg-indigo-100 rounded-lg p-4 shadow-inner">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Kanban Board</h3>
                  <p className="text-indigo-600">
                    Visualize your workflow with our Kanban board. Drag and drop tasks to update their status effortlessly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}