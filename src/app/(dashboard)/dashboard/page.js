'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/stat-card';
import PatientsPerDoctorChart from '@/components/dashboard/patients-per-doctor-chart';
import TrendsChart from '@/components/dashboard/trends-chart';

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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PatientsPerDoctorChart data={analytics?.patientsPerDoctor || []} />
        <TrendsChart
          registrationTrends={analytics?.registrationTrends || []}
          appointmentTrends={analytics?.appointmentTrends || []}
        />
      </div>
    </div>
  );
}