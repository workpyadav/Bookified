import { z } from 'zod';
import {
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from './constants';

export const UploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please upload a PDF file' })
    .refine((f) => f.size <= MAX_FILE_SIZE, 'File size must be under 50MB')
    .refine(
      (f) => ACCEPTED_PDF_TYPES.includes(f.type),
      'Only PDF files are accepted'
    ),

  coverImage: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_IMAGE_SIZE, 'Image must be under 10MB')
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      'Only JPEG, PNG, and WebP images are accepted'
    )
    .optional(),

  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be under 200 characters'),

  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(200, 'Author name must be under 200 characters'),

  voice: z.string().min(1, 'Please select a voice'),
});
