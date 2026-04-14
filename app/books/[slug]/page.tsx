import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IconMicrophoneOff, IconMicrophone, IconArrowLeft } from '@tabler/icons-react';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookDetailsPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect('/');
  }

  const book = result.data;

  return (
    <main className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <IconArrowLeft className="w-6 h-6 text-[var(--text-primary)]" />
      </Link>

      <div className="vapi-main-container space-y-8">
        {/* Header Card */}
        <div className="vapi-header-card w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
            {/* Left: Book Cover & Mic Button */}
            <div className="vapi-cover-wrapper">
              <Image
                src={book.coverURL || '/assets/images/book-placeholder.png'}
                alt={book.title}
                width={162}
                height={240}
                className="vapi-cover-image"
              />
              <div className="vapi-mic-wrapper">
                <button className="vapi-mic-btn shadow-soft-md">
                  <IconMicrophoneOff className="w-8 h-8 text-[#663820]" />
                </button>
              </div>
            </div>

            {/* Right: Book Details & Badges */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-primary)] mb-1">
                {book.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-6">
                by {book.author}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {/* Status Badge */}
                <div className="vapi-status-indicator shadow-soft-sm">
                  <span className="vapi-status-dot vapi-status-dot-ready" />
                  <span className="vapi-status-text">Ready</span>
                </div>

                {/* Voice Badge */}
                <div className="vapi-badge-ai shadow-soft-sm">
                  <span className="vapi-badge-ai-text">Voice: {book.persona || 'Default'}</span>
                </div>

                {/* Timer Badge */}
                <div className="vapi-status-indicator shadow-soft-sm">
                  <span className="vapi-status-text">0:00/15:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="transcript-container shadow-soft min-h-[400px]">
          <div className="transcript-empty">
            <div className="bg-[#f8f4e9] p-6 rounded-full mb-4">
              <IconMicrophone className="w-12 h-12 text-[#663820]" />
            </div>
            <h3 className="transcript-empty-text">No conversation yet</h3>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
