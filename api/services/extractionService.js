const OpenAI = require('openai');
const { buildExtractionPrompt } = require('../prompts/extractionPrompt');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract transactions from file content using OpenAI
 * @param {string} fileContent - Parsed text content from file
 * @param {string} fileName - Original file name for context
 * @returns {Promise<Object>} - Extraction result
 */
async function extractTransactions(fileContent, fileName) {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // Truncate content if too long (to manage tokens)
    const maxChars = 15000;
    const truncatedContent = fileContent.length > maxChars
        ? fileContent.substring(0, maxChars) + '\n\n[Content truncated due to length...]'
        : fileContent;

    const prompt = buildExtractionPrompt(truncatedContent, fileName);

    try {
        const response = await openai.chat.completions.create({
            model: model,
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
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(content);
        return processExtractionResult(parsed);

    } catch (error) {
        console.error('OpenAI extraction error:', error);
        throw new Error(`Extraction failed: ${error.message}`);
    }
}

/**
 * Process and validate extraction result, compute summary stats
 */
function processExtractionResult(rawResult) {
    const bank = rawResult.bank || 'Unknown Bank';
    const transactions = (rawResult.transactions || []).map((tx, index) => ({
        no: index + 1,
        bank: bank,
        amount: Math.abs(Number(tx.amount) || 0),
        type: tx.type === 'Credit' ? 'Credit' : 'Debit',
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
    const bankMap = new Map();
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

module.exports = { extractTransactions };
