import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { patientSchema } from '@/lib/validations/patient.schema';
import { getPatients, createPatient, getConditions } from '@/services/patient.service';

/**
 * GET /api/patients — List all patients with search, filters, pagination
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = {
      search: searchParams.get('search') || '',
      condition: searchParams.get('condition') || '',
      doctorId: searchParams.get('doctorId') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
    };

    const [result, conditions] = await Promise.all([
      getPatients(params),
      getConditions(),
    ]);

    return NextResponse.json({ ...result, conditions });
  } catch (error) {
    console.error('GET /api/patients error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

/**
 * POST /api/patients — Create a new patient
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = patientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const patient = await createPatient(validation.data);
    return NextResponse.json({ patient, message: 'Patient created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/patients error:', error);
    if (error.message?.includes('does not exist')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
