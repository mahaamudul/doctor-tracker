import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const patientSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
    .trim(),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int({ message: 'Age must be a whole number' })
    .min(0, { message: 'Age cannot be negative' })
    .max(150, { message: 'Age must not exceed 150' }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Gender must be Male, Female, or Other' }),
  }),
  condition: z
    .string()
    .min(2, { message: 'Condition is required' })
    .max(200, { message: 'Condition must not exceed 200 characters' })
    .trim(),
  doctorId: z
    .string()
    .regex(objectIdRegex, { message: 'Invalid doctor ID format' }),
  appointmentDate: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : new Date()))
    .optional(),
});
