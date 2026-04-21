import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IconMicrophoneOff, IconMicrophone, IconArrowLeft } from '@tabler/icons-react';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { cn } from '@/lib/utils';
import VapiControls from '@/components/VapiControls';

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


      <VapiControls book={book} />

        
    </main>
  );
}
