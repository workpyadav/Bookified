import { auth } from '@clerk/nextjs/server'
import Hero from '@/components/Hero'
import BookCard from '@/components/BookCard'
import { getAllBooks } from '@/lib/actions/book.actions'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params.query || '';
  const { userId } = await auth()
  const bookResults = await getAllBooks(query)
  const books = bookResults.success ? bookResults.data ?? [] : []
  return (
    <main className="wrapper container flex-1 w-full flex flex-col items-center">
      <Hero />

      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-12 gap-4">
        <h2 className="section-title">Recent Books</h2>
        <Suspense fallback={<div className="h-10 w-64 rounded-full bg-gray-100 animate-pulse"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      <div className='library-books-grid w-full'>
        {books.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
      
      {/* Additional page content (library, etc.) could go here */}
      {!userId && (
        <p className="mt-12 text-black/50 text-base italic">Sign in to start managing your library.</p>
      )}
    </main>
  )
}