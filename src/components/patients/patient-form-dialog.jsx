'use client';

import { useForm } from 'react-hook-form';
import { memo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { patientSchema } from '@/lib/validations/patient.schema';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function PatientFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = null,
  doctors = [],
  loading = false,
}) {
  const formatted = defaultValues
    ? {
        ...defaultValues,
        doctorId: defaultValues.doctorId?._id || defaultValues.doctorId || '',
        appointmentDate: defaultValues.appointmentDate
          ? new Date(defaultValues.appointmentDate).toISOString().split('T')[0]
          : '',
      }
    : {
        name: '',
        age: '',
        gender: 'Male',
        condition: '',
        doctorId: '',
        appointmentDate: '',
      };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      ...formatted,
      age: formatted.age === '' ? undefined : Number(formatted.age),
    },
  });

  const gender = watch('gender');
  const doctorId = watch('doctorId');

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) reset();
        onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
          <DialogDescription>
            {defaultValues
              ? 'Update the patient information below.'
              : 'Fill in the details to register a new patient.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <Input {...register('name')} placeholder="John Doe" disabled={loading} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Age
              </label>
              <Input
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="45"
                disabled={loading}
              />
              {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Gender
              </label>
              <Select
                value={gender}
                onValueChange={(val) => setValue('gender', val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Condition
            </label>
            <Input {...register('condition')} placeholder="Hypertension" disabled={loading} />
            {errors.condition && (
              <p className="text-xs text-red-500">{errors.condition.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assigned Doctor
              </label>
              <Select
                value={doctorId}
                onValueChange={(val) => setValue('doctorId', val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc._id} value={doc._id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p className="text-xs text-red-500">{errors.doctorId.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Appointment Date
              </label>
              <Input type="date" {...register('appointmentDate')} disabled={loading} />
              {errors.appointmentDate && (
                <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {defaultValues ? 'Updating...' : 'Creating...'}
                </>
              ) : defaultValues ? (
                'Update Patient'
              ) : (
                'Add Patient'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(PatientFormDialog);
