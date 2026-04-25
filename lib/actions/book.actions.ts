'use server'

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { revalidatePath } from "next/cache";
import { getUserPlan } from "../subscription";
import { PLAN_LIMITS } from "../subscription-constants";

export const getAllBooks = async (query?: string) => {
    try {
        await connectToDatabase();

        let filter: any = {};
        if (query) {
            filter = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const books = await Book.find(filter).sort({createdAt: -1}).lean();

        return {
            success: true,
            data: serializeData(books)
        }

    } catch (e) {
        console.error('Error connecting to database', e);
        return {
            success: false, error: e
        }
    }
}

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(title);

        const existingBook = await Book.findOne({slug}).lean();

        if(existingBook) {
            return {
                exists: true, book: serializeData(existingBook)
            }
        }
        return {
            exists:false,
        }
    } catch (e) {
        console.error('Error checking book exists', e);
        return {
            exists: false, error: e instanceof Error ? e.message : String(e)
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({slug}).lean();

        if(existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true,
            }
        }

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId || userId != data.clerkId) {
            return { success: false, error: "Unauthorized" };
        }

        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];

        const bookCount = await Book.countDocuments({ clerkId: userId });

        if (bookCount >= limits.maxBooks) {
            return {
                success: false,
                error: `You have reached the maximum number of books (${limits.maxBooks}) allowed for your ${plan} plan. Please upgrade to add more.`,
            }
        }

        const book = await Book.create({...data, clerkId: userId, slug, totalSegments: 0});


        revalidatePath('/')

        return {
            success: true,
            data: serializeData(book),
        }
    } catch (e) {
        console.error('Error creating the book', e);

        return {
            success: false,
            error: e instanceof Error ? e.message : String(e),
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();
        console.log('Saving book segments..');

        const segmentsToInsert = segments.map(({text, segmentIndex, pageNumber, wordCount}) => ({
            clerkId, bookId, content: text, segmentIndex, pageNumber, wordCount
        }));

        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

        console.log('Book segments saved successfully.');

        return{
            success: true,
            data: { segmentsCreated: segments.length}
        }
    } catch (e) {
        console.error('Error saving book segments', e);

        await BookSegment.deleteMany({bookId: bookId});
        await Book.findByIdAndDelete(bookId);
        console.log('Deleted book segments and book due to failure to save segments.');
        return {
            success: false,
            error: e instanceof Error ? e.message : String(e),
        }
    }
}
export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const book = await Book.findOne({ slug }).lean();

        if (!book) {
            return {
                success: false,
                error: 'Book not found'
            }
        }

        return {
            success: true,
            data: serializeData(book)
        }

    } catch (e) {
        console.error('Error fetching book by slug', e);
        return {
            success: false,
            error: e instanceof Error ? e.message : String(e)
        }
    }
}

export const searchBookSegments = async (bookId: string, query: string, limit: number = 3) => {
    try {
        await connectToDatabase();

        const segments = await BookSegment.find(
            { bookId, $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();

        return {
            success: true,
            data: serializeData(segments)
        }
    } catch (e) {
        console.error('Error searching book segments', e);
        return {
            success: false,
            error: e instanceof Error ? e.message : String(e)
        }
    }
}
