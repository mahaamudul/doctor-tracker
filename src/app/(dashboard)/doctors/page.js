'use client';

import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDebouncedCallback } from 'use-debounce';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  Loader2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import DoctorFormDialog from '@/components/doctors/doctor-form-dialog';
import PatientRoster from '@/components/doctors/patient-roster';
import DeleteConfirmDialog from '@/components/shared/delete-confirm-dialog';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [expandedPatients, setExpandedPatients] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Use refs for values that change frequently to avoid stale closures
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchDoctors = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const spec = specialization === 'all' ? '' : specialization;
        const params = new URLSearchParams({
          page: String(page),
          limit: '10',
        });
        if (searchRef.current) params.set('search', searchRef.current);
        if (spec) params.set('specialization', spec);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        const res = await fetch(`/api/doctors?${params}`);
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        setDoctors(data.doctors || []);
        setPagination(data.pagination);
        setSpecializations(data.specializations || []);
      } catch (error) {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    },
    [specialization, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback(() => {
    fetchDoctors(1);
  }, 400);

  // Initial load and when dropdown/date filters change
  useEffect(() => {
    fetchDoctors(1);
  }, [fetchDoctors]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedFetch();
  };

  const fetchRoster = async (doctorId) => {
    setRosterLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/patients`);
      const data = await res.json();
      setExpandedPatients(data.patients || []);
    } catch {
      toast.error('Failed to load patient roster');
    } finally {
      setRosterLoading(false);
    }
  };

  const handleExpand = async (doctorId) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null);
      setExpandedPatients([]);
      return;
    }
    setExpandedDoctor(doctorId);
    await fetchRoster(doctorId);
  };

  const handleRosterUpdate = async (doctorId) => {
    await Promise.all([
      fetchDoctors(pagination.page),
      fetchRoster(doctorId),
    ]);
  };

  const handleCreateDoctor = async (data) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create doctor');

      setShowCreateDialog(false);
      toast.success('Doctor created successfully');
      fetchDoctors(pagination.page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDoctor = async (data) => {
    if (!editingDoctor) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/doctors/${editingDoctor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update doctor');

      setEditingDoctor(null);
      toast.success('Doctor updated successfully');
      fetchDoctors(pagination.page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/doctors/${deleteTarget._id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete doctor');

      setDeleteTarget(null);
      toast.success('Doctor deleted successfully');
      fetchDoctors(pagination.page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage doctor records and their patient assignments.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search doctors..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <Select value={specialization || 'all'} onValueChange={(v) => setSpecialization(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-[160px]"
              placeholder="From"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-[160px]"
              placeholder="To"
            />
            {(search || specialization || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSpecialization('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              No doctors found. Try adjusting your filters or add a new doctor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[40px]" />
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Specialization</TableHead>
                    <TableHead className="hidden md:table-cell w-[180px] max-w-[180px]">Hospital</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-center">Patients</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <Fragment key={doctor._id}>
                      <TableRow className="group">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleExpand(doctor._id)}
                          >
                            {expandedDoctor === doctor._id ? (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-slate-800">{doctor.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {doctor.specialization}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600 max-w-[180px]">
                          <div className="overflow-x-auto whitespace-nowrap max-w-[180px] py-0.5 scrollbar-thin">
                            {doctor.hospital}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {doctor.phone}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600">
                          {doctor.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                            {doctor.patientCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-blue-600"
                              onClick={() => setEditingDoctor(doctor)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-red-600"
                              onClick={() => setDeleteTarget(doctor)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedDoctor === doctor._id && (
                        <TableRow>
                          <TableCell colSpan={8} className="p-0">
                            <div className="px-4 py-3">
                              {rosterLoading ? (
                                <div className="space-y-2 py-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 animate-pulse">
                                      <div className="h-4 w-28 rounded bg-slate-200" />
                                      <div className="h-4 w-16 rounded bg-slate-100" />
                                      <div className="h-4 w-20 rounded bg-slate-100" />
                                      <div className="h-4 w-24 rounded bg-slate-100" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <PatientRoster
                                  doctorId={doctor._id}
                                  patients={expandedPatients}
                                  onUpdate={() => handleRosterUpdate(doctor._id)}
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <p className="text-sm text-slate-500">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchDoctors(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchDoctors(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium text-slate-700">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchDoctors(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchDoctors(pagination.totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DoctorFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateDoctor}
        loading={actionLoading}
      />

      {editingDoctor && (
        <DoctorFormDialog
          open={!!editingDoctor}
          onOpenChange={(val) => !val && setEditingDoctor(null)}
          onSubmit={handleUpdateDoctor}
          defaultValues={editingDoctor}
          loading={actionLoading}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Doctor"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteDoctor}
        loading={actionLoading}
      />
    </div>
  );
}

