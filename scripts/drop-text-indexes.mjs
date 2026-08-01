/**
 * One-time script to drop old MongoDB text indexes that are no longer needed.
 * Run with: node scripts/drop-text-indexes.mjs
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Drop text indexes from doctors collection
  try {
    const doctorIndexes = await db.collection('doctors').indexes();
    for (const idx of doctorIndexes) {
      // Text indexes have a key with value "text"
      const isTextIndex = Object.values(idx.key).some((v) => v === 'text');
      if (isTextIndex) {
        console.log(`Dropping text index "${idx.name}" from doctors...`);
        await db.collection('doctors').dropIndex(idx.name);
        console.log('  ✅ Dropped.');
      }
    }
  } catch (err) {
    console.log('  ⚠️ doctors:', err.message);
  }

  // Drop text indexes from patients collection
  try {
    const patientIndexes = await db.collection('patients').indexes();
    for (const idx of patientIndexes) {
      const isTextIndex = Object.values(idx.key).some((v) => v === 'text');
      if (isTextIndex) {
        console.log(`Dropping text index "${idx.name}" from patients...`);
        await db.collection('patients').dropIndex(idx.name);
        console.log('  ✅ Dropped.');
      }
    }
  } catch (err) {
    console.log('  ⚠️ patients:', err.message);
  }

  console.log('\nDone. Disconnecting...');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
