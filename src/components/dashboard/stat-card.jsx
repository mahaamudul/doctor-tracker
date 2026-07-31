'use client';

import { Stethoscope, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const iconStyles = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
};

const icons = {
  doctors: Stethoscope,
  patients: Users,
  ratio: TrendingUp,
};

export default function StatCard({ label, value, type = 'doctors', color = 'blue' }) {
  const Icon = icons[type] || Stethoscope;

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
