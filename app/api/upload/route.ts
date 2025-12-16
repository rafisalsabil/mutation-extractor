import { NextRequest, NextResponse } from 'next/server';
import { extractTransactions } from '@/lib/server/extractionService';
import { parseFileBuffer } from '@/lib/server/fileParser';

// Max file size (5MB as example)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds limit (5MB)' }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        console.log(`Processing file: ${file.name}`);

        // Parse text content
        const textContent = await parseFileBuffer(buffer, file.name, file.type);

        if (!textContent || textContent.trim().length === 0) {
            return NextResponse.json({
                error: 'Could not extract any text from the file. Please ensure the file contains readable content.'
            }, { status: 400 });
        }

        // Extract with OpenAI
        const result = await extractTransactions(textContent, file.name);

        return NextResponse.json({
            status: 'completed',
            message: 'Extraction successful',
            result
        });

    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
