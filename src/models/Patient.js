import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    condition: { type: String, required: true, trim: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    appointmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// High-performance query indexes
PatientSchema.index({ name: 'text', condition: 'text' });
PatientSchema.index({ doctorId: 1, createdAt: -1 });
PatientSchema.index({ condition: 1, createdAt: -1 });
PatientSchema.index({ createdAt: -1 });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);