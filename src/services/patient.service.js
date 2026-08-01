import connectDB from '@/lib/db';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';

/**
 * Escape special regex characters to prevent ReDoS and syntax errors.
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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

  // Safe regex search — supports partial/prefix matching (e.g. "Dia" matches "Diabetes")
  if (search) {
    const safeSearch = escapeRegex(search);
    const searchRegex = new RegExp(safeSearch, 'i');
    query.$or = [
      { name: searchRegex },
      { condition: searchRegex },
    ];
  }

  // Filter by condition
  if (condition) {
    query.condition = condition;
  }

  // Filter by assigned doctor
  if (doctorId) {
    query.doctorId = doctorId;
  }

  // Date range filter on appointmentDate — explicit UTC boundaries
  if (startDate || endDate) {
    query.appointmentDate = {};
    if (startDate) query.appointmentDate.$gte = new Date(`${startDate}T00:00:00.000Z`);
    if (endDate) query.appointmentDate.$lte = new Date(`${endDate}T23:59:59.999Z`);
  }

  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .select('name age gender condition appointmentDate doctorId createdAt')
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
