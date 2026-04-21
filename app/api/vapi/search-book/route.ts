import { NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message || message.type !== 'tool-calls') {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const toolCalls = message.toolCalls || [];
        const results = [];

        for (const toolCall of toolCalls) {
            if (toolCall.function.name === 'search book') {
                const args = typeof toolCall.function.arguments === 'string' 
                    ? JSON.parse(toolCall.function.arguments) 
                    : toolCall.function.arguments;

                const { bookId, query } = args;

                if (!bookId || !query) {
                    results.push({
                        toolCallId: toolCall.id,
                        result: 'Error: Missing bookId or query parameter.'
                    });
                    continue;
                }

                const searchResult = await searchBookSegments(bookId, query, 3);

                if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
                    const combinedContent = searchResult.data
                        .map((segment: any) => segment.content)
                        .join('\n\n');
                    
                    results.push({
                        toolCallId: toolCall.id,
                        result: combinedContent
                    });
                } else {
                    results.push({
                        toolCallId: toolCall.id,
                        result: 'no information found about this topic'
                    });
                }
            }
        }

        return NextResponse.json({ results });

    } catch (error) {
        console.error('Error in search-book API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
