'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Activity, Lock, Mail, Loader2 } from 'lucide-react';

import { loginSchema } from '@/lib/validations/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error('Authentication Failed', {
          description: res.error || 'Invalid email or password.',
        });
      } else {
        toast.success('Welcome Back!', {
          description: 'Access granted. Redirecting to dashboard...',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Activity className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Doctor Tracker
          </CardTitle>
          <CardDescription className="text-slate-500">
            Secure Administrator Portal Sign In
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="admin@doctortracker.com"
                  className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-sm transition-colors mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
            Demo Credentials: <span className="font-mono text-slate-600">admin@doctortracker.com</span> / <span className="font-mono text-slate-600">AdminSecurePassword123!</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}