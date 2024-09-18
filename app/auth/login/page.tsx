'use client'

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials. Please try again.');
    } else if (result?.ok) {
      router.push('/dashboard');
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
            <CardTitle className="text-3xl font-bold text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-white/80 text-center">Log in to your Task Master account</CardDescription>
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <div className="text-yellow-300 flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700">
                Log In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}