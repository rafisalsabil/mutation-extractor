import OpenAI from 'openai';
import { buildExtractionPrompt } from './extractionPrompt';
import { ExtractionResult, Transaction, BankStats } from '@/types';

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY env var to be set
const openai = new OpenAI();
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

interface RawTransaction {
    amount: number;
    type: string;
    date?: string;
    description?: string;
}

interface RawExtractionResult {
    bank: string;
    transactions: RawTransaction[];
}

/**
 * Extract transactions from file content using OpenAI
 */
export async function extractTransactions(fileContent: string, fileName: string): Promise<ExtractionResult> {
    // Truncate content if too long (to manage tokens)
    const maxChars = 15000;
    const truncatedContent = fileContent.length > maxChars
        ? fileContent.substring(0, maxChars) + '\n\n[Content truncated due to length...]'
        : fileContent;

    const prompt = buildExtractionPrompt(truncatedContent, fileName);

    try {
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert financial document parser. Always respond with valid JSON only, no markdown formatting or code blocks.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.1, // Low temperature for consistent parsing
            // @ts-ignore - OpenAI node SDK typing might be slightly behind on response_format capabilities
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(content) as RawExtractionResult;
        return processExtractionResult(parsed);

    } catch (error) {
        console.error('OpenAI extraction error:', error);
        if (error instanceof Error) {
            throw new Error(`Extraction failed: ${error.message}`);
        }
        throw new Error('Extraction failed with an unknown error');
    }
}

/**
 * Process and validate extraction result, compute summary stats
 */
function processExtractionResult(rawResult: RawExtractionResult): ExtractionResult {
    const bank = rawResult.bank || 'Unknown Bank';
    const transactions: Transaction[] = (rawResult.transactions || []).map((tx, index) => ({
        no: index + 1,
        bank: bank,
        amount: Math.abs(Number(tx.amount) || 0),
        type: (tx.type === 'Credit' || tx.type === 'Debit') ? tx.type as 'Credit' | 'Debit' : 'Debit', // Default to debit if unknown, or handle generic
        date: tx.date || new Date().toISOString().split('T')[0],
        description: tx.description || '',
    }));

    // Calculate summary stats
    const totalCredit = transactions
        .filter(t => t.type === 'Credit')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
        .filter(t => t.type === 'Debit')
        .reduce((sum, t) => sum + t.amount, 0);

    // Group by bank for bank stats
    const bankMap = new Map<string, BankStats>();

    // Initialize with the detected bank
    if (transactions.length > 0) {
        bankMap.set(bank, {
            name: bank,
            txCount: 0,
            creditAmount: 0,
            debitAmount: 0
        });
    }

    transactions.forEach(t => {
        const existing = bankMap.get(t.bank) || {
            name: t.bank,
            txCount: 0,
            creditAmount: 0,
            debitAmount: 0
        };
        existing.txCount++;
        if (t.type === 'Credit') {
            existing.creditAmount += t.amount;
        } else {
            existing.debitAmount += t.amount;
        }
        bankMap.set(t.bank, existing);
    });

    return {
        summary: {
            totalTransactions: transactions.length,
            totalCredit,
            totalDebit,
            netAmount: totalCredit - totalDebit,
            lastUploaded: new Date().toISOString(),
            banks: Array.from(bankMap.values()),
        },
        transactions,
    };
}
