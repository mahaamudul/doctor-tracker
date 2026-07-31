import connectDB from '@/lib/db';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';

/**
 * Get paginated list of doctors with optional search, specialization filter, and date range.
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

  // Text search using MongoDB text index
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by specialization
  if (specialization) {
    query.specialization = specialization;
  }

  // Date range filter on createdAt
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  }

  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Doctor.countDocuments(query),
  ]);

  // Batch-fetch patient counts for each doctor
  const doctorIds = doctors.map((d) => d._id);
  const patientCounts = await Patient.aggregate([
    { $match: { doctorId: { $in: doctorIds } } },
    { $group: { _id: '$doctorId', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  patientCounts.forEach((pc) => {
    countMap[pc._id.toString()] = pc.count;
  });

  const doctorsWithCount = doctors.map((doc) => ({
    ...doc,
    patientCount: countMap[doc._id.toString()] || 0,
  }));

  return {
    doctors: doctorsWithCount,
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
