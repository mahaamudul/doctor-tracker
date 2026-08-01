import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// B-Tree indexes for regex search + sort performance
DoctorSchema.index({ name: 1, createdAt: -1 });
DoctorSchema.index({ specialization: 1, createdAt: -1 });
DoctorSchema.index({ createdAt: -1 });

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);