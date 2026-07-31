'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDebouncedCallback } from 'use-debounce';
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  ChevronLeft,
  ChevronRight,
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
import PatientFormDialog from '@/components/patients/patient-form-dialog';
import DeleteConfirmDialog from '@/components/shared/delete-confirm-dialog';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [conditions, setConditions] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Use refs for values that change frequently to avoid stale closures
  const searchRef = useRef(search);
  searchRef.current = search;

  // Fetch doctors list for the dropdown
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch('/api/doctors?limit=100');
        const data = await res.json();
        setDoctorsList(data.doctors || []);
      } catch {
        // silent fail, dropdown will be empty
      }
    }
    fetchDoctors();
  }, []);

  const fetchPatients = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const cond = condition === 'all' ? '' : condition;
        const params = new URLSearchParams({
          page: String(page),
          limit: '10',
        });
        if (searchRef.current) params.set('search', searchRef.current);
        if (cond) params.set('condition', cond);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        const res = await fetch(`/api/patients?${params}`);
        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(data.patients || []);
        setPagination(data.pagination);
        setConditions(data.conditions || []);
      } catch (error) {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    },
    [condition, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback(() => {
    fetchPatients(1);
  }, 400);

  // Initial load and when dropdown/date filters change
  useEffect(() => {
    fetchPatients(1);
  }, [fetchPatients]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedFetch();
  };

  const handleCreatePatient = async (data) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create patient');

      setShowCreateDialog(false);
      toast.success('Patient created successfully');
      fetchPatients(pagination.page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePatient = async (data) => {
    if (!editingPatient) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/patients/${editingPatient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update patient');

      setEditingPatient(null);
      toast.success('Patient updated successfully');
      fetchPatients(pagination.page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/patients/${deleteTarget._id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete patient');

      setDeleteTarget(null);
      toast.success('Patient deleted successfully');
      fetchPatients(pagination.page);
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all patient records, conditions, and appointments.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <Select value={condition || 'all'} onValueChange={(v) => setCondition(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-[160px]"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-[160px]"
            />
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
          ) : patients.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              No patients found. Try adjusting your filters or add a new patient.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Age</TableHead>
                    <TableHead className="hidden sm:table-cell">Gender</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="hidden md:table-cell">Appointment</TableHead>
                    <TableHead className="hidden lg:table-cell">Doctor</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient._id} className="group">
                      <TableCell className="font-medium text-slate-800">
                        {patient.name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-slate-600">
                        {patient.age}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-slate-600">
                        {patient.gender}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          {patient.condition}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-600">
                        {patient.appointmentDate
                          ? format(new Date(patient.appointmentDate), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-slate-600">
                        {patient.doctorId?.name || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => setEditingPatient(patient)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={() => setDeleteTarget(patient)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchPatients(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchPatients(pagination.page - 1)}
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
                  onClick={() => fetchPatients(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchPatients(pagination.totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PatientFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePatient}
        doctors={doctorsList}
        loading={actionLoading}
      />

      {editingPatient && (
        <PatientFormDialog
          open={!!editingPatient}
          onOpenChange={(val) => !val && setEditingPatient(null)}
          onSubmit={handleUpdatePatient}
          defaultValues={editingPatient}
          doctors={doctorsList}
          loading={actionLoading}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Patient"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeletePatient}
        loading={actionLoading}
      />
    </div>
  );
}
