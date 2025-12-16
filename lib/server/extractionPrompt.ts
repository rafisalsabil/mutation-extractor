const EXTRACTION_PROMPT = `You are a financial document parser specialized in extracting bank mutation/transaction data from Indonesian bank statements.

Analyze the following bank statement content and extract ALL transactions. For each transaction, identify:
1. The bank name (e.g., BCA, Mandiri, BNI, BRI, CIMB, etc.)
2. The transaction amount (as a positive number)
3. The transaction type: "Credit" (money in) or "Debit" (money out)
4. The transaction date (in ISO format YYYY-MM-DD if available, otherwise use today's date)
5. A brief description of the transaction

IMPORTANT RULES:
- Extract EVERY transaction you can find
- Amounts should be positive numbers only (no currency symbols or formatting)
- Determine Credit/Debit based on context (+/-, CR/DB, or transaction flow)
- If the bank name isn't explicitly stated, infer it from the document format/header
- Be thorough - don't miss any transactions

Return your response as a valid JSON object with this exact structure:
{
  "bank": "string - detected bank name",
  "transactions": [
    {
      "amount": number,
      "type": "Credit" | "Debit",
      "date": "YYYY-MM-DD",
      "description": "string"
    }
  ]
}

Here is the bank statement content to analyze:

`;

export function buildExtractionPrompt(fileContent: string, fileName: string): string {
    const contextHint = `\n[File name: ${fileName}]\n\n`;
    return EXTRACTION_PROMPT + contextHint + fileContent;
}
