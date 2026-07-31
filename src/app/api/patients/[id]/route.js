import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { patientSchema } from '@/lib/validations/patient.schema';
import { updatePatient, deletePatient } from '@/services/patient.service';

/**
 * PUT /api/patients/[id] — Update a patient
 */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = patientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const patient = await updatePatient(id, validation.data);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient, message: 'Patient updated successfully' });
  } catch (error) {
    console.error('PUT /api/patients/[id] error:', error);
    if (error.message?.includes('does not exist')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

/**
 * DELETE /api/patients/[id] — Delete a patient
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const patient = await deletePatient(id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
