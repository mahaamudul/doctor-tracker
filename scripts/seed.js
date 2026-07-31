import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';


// Fix MongoDB Atlas SRV connection lookup issues on Windows
dns.setServers([ '1.1.1.1','8.8.8.8' ]);

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  hospital: String,
  phone: String,
  email: { type: String, unique: true },
});

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  condition: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointmentDate: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('AdminSecurePassword123!', 10);
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@doctortracker.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Created Admin user: ${admin.email}`);

    // 2. Create Sample Doctors
    const doctors = await Doctor.create([
      {
        name: 'Dr. Sarah Jenkins',
        specialization: 'Cardiology',
        hospital: 'City General Hospital',
        phone: '+1-555-0192',
        email: 'sarah.jenkins@hospital.com',
      },
      {
        name: 'Dr. Robert Chen',
        specialization: 'Neurology',
        hospital: 'St. Jude Medical Center',
        phone: '+1-555-0144',
        email: 'robert.chen@stjude.org',
      },
      {
        name: 'Dr. Emily Vance',
        specialization: 'Pediatrics',
        hospital: 'Children Health Institute',
        phone: '+1-555-0188',
        email: 'emily.vance@childrenhealth.org',
      },
    ]);
    console.log(`Created ${doctors.length} sample doctors.`);

    // 3. Create Sample Patients
    const patients = await Patient.create([
      {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        condition: 'Hypertension',
        doctorId: doctors[0]._id,
        appointmentDate: new Date('2026-07-15'),
      },
      {
        name: 'Alice Smith',
        age: 32,
        gender: 'Female',
        condition: 'Arrhythmia',
        doctorId: doctors[0]._id,
        appointmentDate: new Date('2026-07-20'),
      },
      {
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        condition: 'Migraine',
        doctorId: doctors[1]._id,
        appointmentDate: new Date('2026-07-22'),
      },
      {
        name: 'Sophia Wilson',
        age: 8,
        gender: 'Female',
        condition: 'Asthma',
        doctorId: doctors[2]._id,
        appointmentDate: new Date('2026-07-28'),
      },
    ]);
    console.log(`Created ${patients.length} sample patients.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();