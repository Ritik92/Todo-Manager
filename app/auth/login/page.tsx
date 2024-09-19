'use client'

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const loginToast = toast.loading('Logging in...');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        toast.error('Login failed. Please check your credentials.', { id: loginToast });
      } else if (result?.ok) {
        toast.success(
          (t) => (
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Logged in successfully!
            </span>
          ),
          { id: loginToast }
        );
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.', { id: loginToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600 text-center">Log in to your Task Master account</CardDescription>
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
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
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}