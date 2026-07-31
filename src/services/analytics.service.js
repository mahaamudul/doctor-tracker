import connectDB from '@/lib/db';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';

/**
 * Get all dashboard analytics using a single $facet aggregation pipeline.
 * Returns: totalDoctors, totalPatients, patientsPerDoctor distribution, and date trends.
 */
export async function getDashboardAnalytics() {
  await connectDB();

  // We need the Doctor count separately since $facet runs against one collection
  const totalDoctors = await Doctor.countDocuments();

  const [result] = await Patient.aggregate([
    {
      $facet: {
        // Total patient count
        totalPatients: [{ $count: 'count' }],

        // Patients per doctor distribution
        patientsPerDoctor: [
          {
            $group: {
              _id: '$doctorId',
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'doctors',
              localField: '_id',
              foreignField: '_id',
              as: 'doctor',
            },
          },
          { $unwind: '$doctor' },
          {
            $project: {
              _id: 0,
              doctorId: '$_id',
              doctorName: '$doctor.name',
              specialization: '$doctor.specialization',
              patientCount: '$count',
            },
          },
          { $sort: { patientCount: -1 } },
        ],

        // Registration trends (patients created per month)
        registrationTrends: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              _id: 0,
              year: '$_id.year',
              month: '$_id.month',
              count: 1,
            },
          },
        ],

        // Appointment trends (appointments per month)
        appointmentTrends: [
          {
            $match: { appointmentDate: { $ne: null } },
          },
          {
            $group: {
              _id: {
                year: { $year: '$appointmentDate' },
                month: { $month: '$appointmentDate' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              _id: 0,
              year: '$_id.year',
              month: '$_id.month',
              count: 1,
            },
          },
        ],

        // Recent patients (last 5)
        recentPatients: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'doctors',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor',
            },
          },
          { $unwind: '$doctor' },
          {
            $project: {
              name: 1,
              condition: 1,
              appointmentDate: 1,
              createdAt: 1,
              doctorName: '$doctor.name',
            },
          },
        ],
      },
    },
  ]);

  const totalPatients = result.totalPatients[0]?.count || 0;

  return {
    totalDoctors,
    totalPatients,
    patientsPerDoctorRatio: totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : '0',
    patientsPerDoctor: result.patientsPerDoctor,
    registrationTrends: result.registrationTrends,
    appointmentTrends: result.appointmentTrends,
    recentPatients: result.recentPatients,
  };
}
