'use client';

import { useState, useEffect } from 'react';
import { Loader2, UserCheck, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/dashboard/stat-card';
import PatientsPerDoctorChart from '@/components/dashboard/patients-per-doctor-chart';
import TrendsChart from '@/components/dashboard/trends-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatDateSafely = (dateVal) => {
  if (!dateVal) return '—';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '—';
  return format(d, 'MMM d, yyyy');
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Real-time analytics for doctors and patient management.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Doctors"
          value={analytics?.totalDoctors ?? 0}
          type="doctors"
          color="blue"
        />
        <StatCard
          label="Total Patients"
          value={analytics?.totalPatients ?? 0}
          type="patients"
          color="emerald"
        />
        <StatCard
          label="Patients / Doctor"
          value={analytics?.patientsPerDoctorRatio ?? '0'}
          type="ratio"
          color="violet"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PatientsPerDoctorChart data={analytics?.patientsPerDoctor || []} />
        <TrendsChart
          registrationTrends={analytics?.registrationTrends || []}
          appointmentTrends={analytics?.appointmentTrends || []}
        />
      </div>

      {/* Recent Activity: Recently Registered Patients */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-blue-600" />
            Recently Registered Patients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {analytics?.recentPatients?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {analytics.recentPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {patient.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
                      <p className="text-xs text-slate-400">Assigned to: <span className="font-medium text-slate-600">{patient.doctorName}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {patient.condition}
                    </span>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDateSafely(patient.appointmentDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-sm text-slate-400 text-center">No recent patient registrations found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}