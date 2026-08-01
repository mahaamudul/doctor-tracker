'use client';

import { memo } from 'react';
import { Stethoscope, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  doctors: Stethoscope,
  patients: Users,
  ratio: TrendingUp,
};

function StatCard({ label, value, type = 'doctors' }) {
  const Icon = icons[type] || Stethoscope;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-6 shadow-sm hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 ease-out">
      {/* Subtle gradient accent glow on hover */}
      <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-blue-500/[0.03] group-hover:bg-blue-500/[0.06] transition-colors duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[13px] font-medium tracking-wide text-slate-400 uppercase">
            {label}
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        {/* Icon — consistent blue across all cards */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100/60 group-hover:bg-blue-100/80 group-hover:ring-blue-200/80 transition-all duration-300">
          <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.8} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="mt-5 h-[3px] w-10 rounded-full bg-blue-500/20 group-hover:w-16 group-hover:bg-blue-500/40 transition-all duration-500 ease-out" />
    </div>
  );
}

export default memo(StatCard);
