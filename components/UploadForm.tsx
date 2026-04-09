'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { UploadSchema } from '@/lib/zod';
import { voiceOptions, voiceCategories, DEFAULT_VOICE } from '@/lib/constants';
import LoadingOverlay from './LoadingOverlay';
import type { BookUploadFormValues } from '@/types';

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: '',
      author: '',
      voice: DEFAULT_VOICE,
    },
  });

  const selectedFile = form.watch('file');
  const selectedCover = form.watch('coverImage');
  const selectedVoice = form.watch('voice');

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: handle form submission
      console.log('Form data:', data);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="new-book-wrapper space-y-8"
      >
        {/* ═══════════════ 1. PDF Upload ═══════════════ */}
        <div>
          <label className="form-label">Book PDF File</label>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                form.setValue('file', file, { shouldValidate: true });
              }
            }}
          />

          {!selectedFile ? (
            <div
              className="upload-dropzone border-2 border-dashed border-[var(--border-medium)]"
              onClick={() => pdfInputRef.current?.click()}
            >
              <IconUpload className="upload-dropzone-icon" />
              <p className="upload-dropzone-text">Click to upload PDF</p>
              <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
            </div>
          ) : (
            <div className="upload-dropzone upload-dropzone-uploaded border-2 border-dashed border-[#8B7355]">
              <div className="flex items-center gap-3">
                <p className="upload-dropzone-text font-semibold">
                  {selectedFile.name}
                </p>
                <button
                  type="button"
                  className="upload-dropzone-remove"
                  onClick={() => {
                    form.setValue('file', undefined as unknown as File, {
                      shouldValidate: true,
                    });
                    if (pdfInputRef.current) pdfInputRef.current.value = '';
                  }}
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {form.formState.errors.file && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.file.message as string}
            </p>
          )}
        </div>

        {/* ═══════════════ 2. Cover Image ═══════════════ */}
        <div>
          <label className="form-label">
            Cover Image{' '}
            <span className="text-[var(--text-muted)] font-normal italic">
              (Optional)
            </span>
          </label>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                form.setValue('coverImage', file, { shouldValidate: true });
              }
            }}
          />

          {!selectedCover ? (
            <div
              className="upload-dropzone border-2 border-dashed border-[var(--border-medium)]"
              onClick={() => coverInputRef.current?.click()}
            >
              <IconPhoto className="upload-dropzone-icon" />
              <p className="upload-dropzone-text">Click to upload cover image</p>
              <p className="upload-dropzone-hint">
                Leave empty to auto-generate from PDF
              </p>
            </div>
          ) : (
            <div className="upload-dropzone upload-dropzone-uploaded border-2 border-dashed border-[#8B7355]">
              <div className="flex items-center gap-3">
                <p className="upload-dropzone-text font-semibold">
                  {selectedCover.name}
                </p>
                <button
                  type="button"
                  className="upload-dropzone-remove"
                  onClick={() => {
                    form.setValue('coverImage', undefined, {
                      shouldValidate: true,
                    });
                    if (coverInputRef.current) coverInputRef.current.value = '';
                  }}
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {form.formState.errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.coverImage.message as string}
            </p>
          )}
        </div>

        {/* ═══════════════ 3. Title ═══════════════ */}
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input border border-[var(--border-subtle)]"
            placeholder="ex: Rich Dad Poor Dad"
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* ═══════════════ 4. Author ═══════════════ */}
        <div>
          <label className="form-label">Author Name</label>
          <input
            type="text"
            className="form-input border border-[var(--border-subtle)]"
            placeholder="ex: Robert Kiyosaki"
            {...form.register('author')}
          />
          {form.formState.errors.author && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.author.message}
            </p>
          )}
        </div>

        {/* ═══════════════ 5. Voice Selector ═══════════════ */}
        <div>
          <label className="form-label">Choose Assistant Voice</label>

          {/* Male Voices */}
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2 italic">
            Male Voices
          </p>
          <div className="voice-selector-options mb-4">
            {voiceCategories.male.map((key) => {
              const voice = voiceOptions[key as keyof typeof voiceOptions];
              const isSelected = selectedVoice === key;
              return (
                <label
                  key={key}
                  className={`voice-selector-option ${
                    isSelected
                      ? 'voice-selector-option-selected'
                      : 'voice-selector-option-default'
                  }`}
                >
                  <input
                    type="radio"
                    value={key}
                    className="accent-[#663820]"
                    {...form.register('voice')}
                  />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {voice.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-tight">
                      {voice.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Female Voices */}
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2 italic">
            Female Voices
          </p>
          <div className="voice-selector-options">
            {voiceCategories.female.map((key) => {
              const voice = voiceOptions[key as keyof typeof voiceOptions];
              const isSelected = selectedVoice === key;
              return (
                <label
                  key={key}
                  className={`voice-selector-option ${
                    isSelected
                      ? 'voice-selector-option-selected'
                      : 'voice-selector-option-default'
                  }`}
                >
                  <input
                    type="radio"
                    value={key}
                    className="accent-[#663820]"
                    {...form.register('voice')}
                  />
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {voice.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-tight">
                      {voice.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {form.formState.errors.voice && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.voice.message}
            </p>
          )}
        </div>

        {/* ═══════════════ Submit ═══════════════ */}
        <button type="submit" className="form-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Uploading…' : 'Begin Synthesis'}
        </button>
      </form>
    </>
  );
};

export default UploadForm;