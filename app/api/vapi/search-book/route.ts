import { NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message || message.type !== 'tool-calls') {
            console.error('Invalid message type or missing message:', body);
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Vapi might send `toolWithToolCallList` instead of `toolCalls` depending on version
        const toolCalls = message.toolCalls || (message.toolWithToolCallList || []).map((t: any) => t.toolCall) || [];
        const results = [];

        for (const toolCall of toolCalls) {
            const functionName = toolCall?.function?.name;
            
            if (functionName && functionName.includes('search')) {
                try {
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
                } catch (err: any) {
                    console.error('Error processing tool call:', err);
                    results.push({
                        toolCallId: toolCall?.id || 'unknown',
                        result: `Error processing tool call: ${err.message}`
                    });
                }
            }
        }

        return NextResponse.json({ results });

    } catch (error: any) {
        console.error('Error in search-book API route:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
