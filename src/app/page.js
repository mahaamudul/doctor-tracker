import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  Activity,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  Stethoscope,
  Users,
  BarChart3,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <div className="h-screen flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-600/20">
            <Activity className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">Doctor</span>
            <span className="text-base font-bold tracking-tight text-blue-600">Tracker</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-800">{session.user.name}</p>
                <p className="text-[11px] text-slate-400">{session.user.email}</p>
              </div>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'sm' }),
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 text-sm'
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 text-sm'
              )}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main — fills remaining space */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Hero + Features combined */}
        <section className="flex-1 flex flex-col justify-center px-5 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-4xl w-full text-center space-y-5">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Admin Portal
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
              Healthcare Management,{' '}
              <span className="text-blue-600">Simplified.</span>
            </h1>

            <p className="mx-auto max-w-lg text-sm text-slate-500 leading-relaxed sm:text-base">
              Manage doctors, assign patients, track appointments, and visualize clinical analytics — all from one admin dashboard.
            </p>

            {/* CTA */}
            <div className="pt-1">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'default' }),
                    'bg-blue-600 hover:bg-blue-700 text-white px-7 py-5 shadow-md shadow-blue-600/15 inline-flex items-center gap-2'
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'default' }),
                    'bg-blue-600 hover:bg-blue-700 text-white px-7 py-5 shadow-md shadow-blue-600/15 inline-flex items-center gap-2'
                  )}
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                {
                  icon: Stethoscope,
                  title: 'Doctor Directory',
                  desc: 'Search, filter, and manage doctor profiles with specialization and hospital tracking.',
                },
                {
                  icon: Users,
                  title: 'Patient Management',
                  desc: 'Assign patients, track conditions, manage appointments with inline doctor rosters.',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics Dashboard',
                  desc: 'Real-time KPIs and trend charts powered by optimized MongoDB aggregation pipelines.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left hover:shadow-md hover:border-blue-200/80 transition-all duration-300"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100/60 mb-2.5 group-hover:bg-blue-100/80 transition-colors duration-300">
                    <feature.icon className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="shrink-0 bg-slate-900 py-3 px-5 sm:px-6">
          <div className="mx-auto max-w-4xl flex items-center justify-center gap-6 sm:gap-10 text-center">
            <span className="text-xs font-medium text-slate-400">Optimized MongoDB</span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="text-xs font-medium text-slate-400">JWT Auth</span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="text-xs font-medium text-slate-400">Recharts Analytics</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-slate-100 bg-white py-3">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 flex items-center justify-between text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Doctor Tracker</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-700 transition-colors">Sign In</Link>
            <Link href="/dashboard" className="hover:text-slate-700 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}