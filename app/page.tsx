"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to
          <br />
          <span className="text-blue-600">
            Task Master
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Boost your productivity with our intuitive task management platform. Organize, prioritize, and conquer your goals.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center mb-16">
          <Link href="/auth/login" passHref>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { title: "Intuitive Interface", description: "Easy-to-use dashboard for effortless task management" },
          { title: "Collaboration", description: "Work together with your team in real-time" },
          { title: "Progress Tracking", description: "Visualize your productivity with insightful analytics" },
        ].map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}