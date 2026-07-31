import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  Activity,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
  LineChart,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-600/25">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Doctor</span>
            <span className="text-lg font-bold tracking-tight text-blue-600">Tracker</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-800">{session.user.name}</p>
                <p className="text-[11px] text-slate-500">{session.user.email}</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              User Portal Overview • Authenticated Admin Access
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Healthcare & Doctor Management Portal
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Streamline clinical operations, manage doctor profiles, track assigned patient rosters, 
              and analyze healthcare metrics with performance-optimized data aggregation.
            </p>

            {/* Dynamic Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {isAuthenticated ? (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-6 shadow-md shadow-blue-600/20"
                >
                  <Link href="/dashboard" className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-6 shadow-md shadow-blue-600/20"
                >
                  <Link href="/login" className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-5 w-5" />
                    Wanna Go to Dashboard? Sign In First
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Doctor Directory</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Full doctor lifecycle management with specialization filtering, text search, hospital records, and date filters.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Patient Rosters</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Assign patients to doctors, track medical conditions, manage appointment dates, and inspect inline doctor rosters.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Analytics & Trends</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Visual charts powered by MongoDB single-pipeline `$facet` aggregations for patients-per-doctor and registration trends.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* System Benefits Banner */}
        <section className="bg-slate-900 py-12 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">MongoDB Index & Lean Query Performance</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">NextAuth JWT Protected System</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Recharts Visual Analytics</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Doctor Tracker. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-800 transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="hover:text-slate-800 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}