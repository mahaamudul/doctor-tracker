'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2, Plus, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DeleteConfirmDialog from '@/components/shared/delete-confirm-dialog';

export default function PatientRoster({ doctorId, patients: initialPatients, onUpdate }) {
  const [patients, setPatients] = useState(initialPatients || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    appointmentDate: '',
  });

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10),
          appointmentDate: formData.appointmentDate || new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add patient');

      setPatients((prev) => [data.patient, ...prev]);
      setFormData({ name: '', age: '', gender: 'Male', condition: '', appointmentDate: '' });
      setShowAddForm(false);
      toast.success('Patient added successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/doctors/${doctorId}/patients?patientId=${deleteTarget._id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete patient');

      setPatients((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success('Patient removed successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <UserRound className="h-4 w-4 text-slate-400" />
          Assigned Patients ({patients.length})
        </h4>
        <Button
          size="sm"
          variant={showAddForm ? 'outline' : 'default'}
          className={showAddForm ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {showAddForm ? 'Cancel' : 'Add Patient'}
        </Button>
      </div>

      {/* Quick Add Patient Form */}
      {showAddForm && (
        <form onSubmit={handleAddPatient} className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              placeholder="Patient Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Age *"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              disabled={loading}
              className="text-sm"
            />
            <Select
              value={formData.gender}
              onValueChange={(val) => setFormData({ ...formData, gender: val })}
              disabled={loading}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Condition *"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              disabled={loading}
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              disabled={loading}
              className="text-sm max-w-[200px]"
            />
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      )}

      {/* Patient List */}
      {patients.length > 0 ? (
        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {patients.map((patient) => (
            <div key={patient._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="font-medium text-slate-800 truncate">{patient.name}</span>
                <span className="text-slate-400 hidden sm:inline">
                  {patient.age}y, {patient.gender}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {patient.condition}
                </span>
                {patient.appointmentDate && (
                  <span className="text-xs text-slate-400 hidden md:inline">
                    {format(new Date(patient.appointmentDate), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                onClick={() => setDeleteTarget(patient)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-4">No patients assigned yet.</p>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Remove Patient"
        description={`Remove "${deleteTarget?.name}" from this doctor's roster? The patient record will be permanently deleted.`}
        onConfirm={handleDeletePatient}
        loading={loading}
      />
    </div>
  );
}
