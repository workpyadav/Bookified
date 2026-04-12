import { z } from 'zod';
import {
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from './constants';

export const UploadSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be under 200 characters'),

  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(200, 'Author name must be under 200 characters'),

  persona: z.string().min(1, 'Please select a voice'),

  pdfFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Please upload a PDF file')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'PDF must be smaller than 50 MB')
    .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), 'Only .pdf files are accepted'),

  coverImage: z
    .custom<FileList>()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_IMAGE_SIZE,
      'Image must be smaller than 10 MB',
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      'Only .jpg, .png, and .webp images are accepted',
    )
    .optional(),
});
