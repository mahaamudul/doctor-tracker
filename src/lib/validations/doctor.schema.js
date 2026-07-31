import { z } from 'zod';

export const doctorSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
    .trim(),
  specialization: z
    .string()
    .min(2, { message: 'Specialization is required' })
    .max(100, { message: 'Specialization must not exceed 100 characters' })
    .trim(),
  hospital: z
    .string()
    .min(2, { message: 'Hospital name is required' })
    .max(150, { message: 'Hospital name must not exceed 150 characters' })
    .trim(),
  phone: z
    .string()
    .min(7, { message: 'Phone number must be at least 7 characters' })
    .max(20, { message: 'Phone number must not exceed 20 characters' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),
});
