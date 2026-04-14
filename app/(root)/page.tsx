import { auth } from '@clerk/nextjs/server'
import Hero from '@/components/Hero'
import BookCard from '@/components/BookCard'
import { getAllBooks } from '@/lib/actions/book.actions'

export default async function Page() {
  const { userId } = await auth()
  const bookResults = await getAllBooks()
  const books = bookResults.success ? bookResults.data ?? [] : []
  console.log("result"+bookResults.data)
  return (
    <main className="wrapper container flex-1 w-full flex flex-col items-center">
      <Hero />

      <div className='library-books-grid'>
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