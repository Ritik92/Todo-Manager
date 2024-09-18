"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 overflow-hidden relative">
      {/* Background animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-white opacity-10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-white opacity-10 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="z-10 text-center">
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Task Master
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl sm:text-2xl text-white mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Boost your productivity with our intuitive task management platform. Organize, prioritize, and conquer your goals.
        </motion.p>
        
        <motion.div 
          className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/auth/login" passHref>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-purple-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Feature highlights */}
      <motion.div 
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-white max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {[
          { title: "Intuitive Interface", description: "Easy-to-use dashboard for effortless task management" },
          { title: "Collaboration", description: "Work together with your team in real-time" },
          { title: "Progress Tracking", description: "Visualize your productivity with insightful analytics" },
        ].map((feature, index) => (
          <div key={index} className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm opacity-80">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}