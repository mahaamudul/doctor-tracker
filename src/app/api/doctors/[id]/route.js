import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { doctorSchema } from '@/lib/validations/doctor.schema';
import { getDoctorById, updateDoctor, deleteDoctor } from '@/services/doctor.service';

/**
 * GET /api/doctors/[id] — Get doctor detail with patient roster
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const doctor = await getDoctorById(id);

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('GET /api/doctors/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

/**
 * PUT /api/doctors/[id] — Update a doctor
 */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = doctorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const doctor = await updateDoctor(id, validation.data);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor, message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('PUT /api/doctors/[id] error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A doctor with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

/**
 * DELETE /api/doctors/[id] — Delete a doctor (cascade check)
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const doctor = await deleteDoctor(id);

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/doctors/[id] error:', error);
    if (error.message?.includes('Cannot delete doctor')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
