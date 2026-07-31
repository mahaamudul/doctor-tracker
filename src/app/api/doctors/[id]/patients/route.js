import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { patientSchema } from '@/lib/validations/patient.schema';
import connectDB from '@/lib/db';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';

/**
 * GET /api/doctors/[id]/patients — List patients assigned to this doctor
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const doctor = await Doctor.findById(id).lean();
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const patients = await Patient.find({ doctorId: id })
      .sort({ appointmentDate: -1 })
      .lean();

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('GET /api/doctors/[id]/patients error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

/**
 * POST /api/doctors/[id]/patients — Create a patient under this doctor
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const doctor = await Doctor.findById(id).lean();
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const body = await request.json();
    // Override doctorId with the URL param
    const validation = patientSchema.safeParse({ ...body, doctorId: id });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const patient = await Patient.create(validation.data);
    return NextResponse.json({ patient: patient.toObject(), message: 'Patient added successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctors/[id]/patients error:', error);
    return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
  }
}

/**
 * DELETE /api/doctors/[id]/patients?patientId=xxx — Remove a patient from this doctor
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'patientId query parameter is required' }, { status: 400 });
    }

    await connectDB();

    const patient = await Patient.findOneAndDelete({ _id: patientId, doctorId: id });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found under this doctor' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient removed successfully' });
  } catch (error) {
    console.error('DELETE /api/doctors/[id]/patients error:', error);
    return NextResponse.json({ error: 'Failed to remove patient' }, { status: 500 });
  }
}
