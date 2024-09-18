'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const response1 = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
    if (response.ok) {
      router.push('/dashboard');
    } else {
     
      setError( 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Join Task Master</CardTitle>
            <CardDescription className="text-white/80 text-center">Create your account and start managing tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/50 border-white/20 focus:border-white"
                  placeholder="Choose a username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/50 border-white/20 focus:border-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/50 border-white/20 focus:border-white"
                  placeholder="Create a password"
                />
              </div>
              {error && (
                <div className="text-yellow-300 flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}