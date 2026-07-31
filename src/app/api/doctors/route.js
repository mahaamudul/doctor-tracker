import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { doctorSchema } from '@/lib/validations/doctor.schema';
import { getDoctors, createDoctor, getSpecializations } from '@/services/doctor.service';

/**
 * GET /api/doctors — List doctors with search, filters, pagination
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
      specialization: searchParams.get('specialization') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '10', 10),
    };

    // Include specializations list for filter dropdown
    const [result, specializations] = await Promise.all([
      getDoctors(params),
      getSpecializations(),
    ]);

    return NextResponse.json({ ...result, specializations });
  } catch (error) {
    console.error('GET /api/doctors error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

/**
 * POST /api/doctors — Create a new doctor
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = doctorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const doctor = await createDoctor(validation.data);
    return NextResponse.json({ doctor, message: 'Doctor created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctors error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A doctor with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
