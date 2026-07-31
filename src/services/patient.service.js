import connectDB from '@/lib/db';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';

/**
 * Get paginated list of patients with optional search, condition filter, doctor filter, and date range.
 */
export async function getPatients({
  search = '',
  condition = '',
  doctorId = '',
  startDate = '',
  endDate = '',
  page = 1,
  limit = 10,
} = {}) {
  await connectDB();

  const query = {};

  // Text search using MongoDB text index on name and condition
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by condition
  if (condition) {
    query.condition = condition;
  }

  // Filter by assigned doctor
  if (doctorId) {
    query.doctorId = doctorId;
  }

  // Date range filter on appointmentDate
  if (startDate || endDate) {
    query.appointmentDate = {};
    if (startDate) query.appointmentDate.$gte = new Date(startDate);
    if (endDate) query.appointmentDate.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  }

  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new patient. Validates that the assigned doctor exists.
 */
export async function createPatient(data) {
  await connectDB();

  const doctorExists = await Doctor.findById(data.doctorId).lean();
  if (!doctorExists) {
    throw new Error('Assigned doctor does not exist');
  }

  const patient = await Patient.create(data);
  return patient.toObject();
}

/**
 * Update a patient by ID.
 */
export async function updatePatient(id, data) {
  await connectDB();

  // If doctorId is being changed, validate the new doctor exists
  if (data.doctorId) {
    const doctorExists = await Doctor.findById(data.doctorId).lean();
    if (!doctorExists) {
      throw new Error('Assigned doctor does not exist');
    }
  }

  const patient = await Patient.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('doctorId', 'name specialization')
    .lean();

  return patient;
}

/**
 * Delete a patient by ID.
 */
export async function deletePatient(id) {
  await connectDB();
  const patient = await Patient.findByIdAndDelete(id).lean();
  return patient;
}

/**
 * Get distinct conditions for filter dropdowns.
 */
export async function getConditions() {
  await connectDB();
  return Patient.distinct('condition');
}
