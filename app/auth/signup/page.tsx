'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const signupToast = toast.loading('Creating your account...');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast.success('Account created successfully!', { id: signupToast });
        const signInResult = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          toast.success('Logged in successfully!');
          router.push('/dashboard');
        } else {
          toast.error('Account created, but login failed. Please try logging in manually.');
          router.push('/auth/login');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred. Please try again.');
        toast.error('Signup failed. Please try again.', { id: signupToast });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.', { id: signupToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Join Task Master</CardTitle>
          <CardDescription className="text-gray-600 text-center">Create your account and start managing tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {error && (
              <div className="text-red-500 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}