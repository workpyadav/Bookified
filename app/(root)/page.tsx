import { auth } from '@clerk/nextjs/server'
import Hero from '@/components/Hero'
import BookCard from '@/components/BookCard'
import { sampleBooks } from '@/lib/constants'

export default async function Page() {
  const { userId } = await auth()

  return (
    <main className="wrapper container flex-1 w-full flex flex-col items-center">
      <Hero />

      <div className='library-books-grid'>
        {sampleBooks.map((book) => (
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