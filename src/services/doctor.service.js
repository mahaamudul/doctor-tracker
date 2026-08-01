import connectDB from '@/lib/db';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';

/**
 * Escape special regex characters to prevent ReDoS and syntax errors.
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Get paginated list of doctors with optional search, specialization filter, and date range.
 * Uses a single $facet aggregation pipeline for optimal performance (1 DB round trip).
 */
export async function getDoctors({
  search = '',
  specialization = '',
  startDate = '',
  endDate = '',
  page = 1,
  limit = 10,
} = {}) {
  await connectDB();

  const query = {};

  // Safe regex search — supports partial/prefix matching (e.g. "Sar" matches "Sarah")
  if (search) {
    const safeSearch = escapeRegex(search);
    const searchRegex = new RegExp(safeSearch, 'i');
    query.$or = [
      { name: searchRegex },
      { specialization: searchRegex },
      { hospital: searchRegex },
    ];
  }

  // Filter by specialization
  if (specialization) {
    query.specialization = specialization;
  }

  // Date range filter on createdAt — explicit UTC boundaries
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
    if (endDate) query.createdAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
  }

  const skip = (page - 1) * limit;

  // Single $facet pipeline: doctors + totalCount + patientCounts in 1 DB round trip
  const [result] = await Doctor.aggregate([
    { $match: query },
    {
      $facet: {
        doctors: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'patients',
              localField: '_id',
              foreignField: 'doctorId',
              as: '_patients',
            },
          },
          {
            $addFields: {
              patientCount: { $size: '$_patients' },
            },
          },
          { $project: { _patients: 0 } },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const doctors = result.doctors || [];
  const total = result.totalCount[0]?.count || 0;

  return {
    doctors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new doctor.
 */
export async function createDoctor(data) {
  await connectDB();
  const doctor = await Doctor.create(data);
  return doctor.toObject();
}

/**
 * Get a single doctor by ID with their assigned patient roster.
 */
export async function getDoctorById(id) {
  await connectDB();

  const doctor = await Doctor.findById(id).lean();
  if (!doctor) return null;

  const patients = await Patient.find({ doctorId: id })
    .select('name age gender condition appointmentDate createdAt')
    .sort({ appointmentDate: -1 })
    .lean();

  return { ...doctor, patients };
}

/**
 * Update a doctor by ID.
 */
export async function updateDoctor(id, data) {
  await connectDB();
  const doctor = await Doctor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  return doctor;
}

/**
 * Delete a doctor by ID. Fails if patients are still assigned.
 */
export async function deleteDoctor(id) {
  await connectDB();

  const patientCount = await Patient.countDocuments({ doctorId: id });
  if (patientCount > 0) {
    throw new Error(
      `Cannot delete doctor: ${patientCount} patient(s) are still assigned. Remove or reassign them first.`
    );
  }

  const doctor = await Doctor.findByIdAndDelete(id).lean();
  return doctor;
}

/**
 * Get distinct specializations for filter dropdowns.
 */
export async function getSpecializations() {
  await connectDB();
  return Doctor.distinct('specialization');
}
