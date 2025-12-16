import path from 'path';
import { PDFParse } from 'pdf-parse';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse buffer content based on file type
 */
export async function parseFileBuffer(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const ext = path.extname(fileName).toLowerCase();

    if (mimeType === 'application/pdf' || ext === '.pdf') {
        return parsePDF(buffer);
    } else if (mimeType === 'text/csv' || ext === '.csv') {
        return parseCSV(buffer);
    } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel' ||
        ext === '.xlsx' ||
        ext === '.xls'
    ) {
        return parseExcel(buffer);
    } else {
        throw new Error(`Unsupported file type: ${mimeType || ext}`);
    }
}

/**
 * Extract text from PDF buffer
 */
async function parsePDF(buffer: Buffer): Promise<string> {
    try {
        // Convert Buffer to Uint8Array for pdf-parse v2
        const uint8Array = new Uint8Array(buffer);
        const parser = new PDFParse({ data: uint8Array });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
    }
}

/**
 * Parse CSV buffer to text
 */
async function parseCSV(buffer: Buffer): Promise<string> {
    const fileContent = buffer.toString('utf8');
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result: any) => {
                if (result.data.length === 0) {
                    resolve(fileContent);
                    return;
                }

                const headers = Object.keys(result.data[0] || {});
                let textOutput = headers.join(' | ') + '\n';
                textOutput += '-'.repeat(50) + '\n';

                result.data.forEach((row: any) => {
                    const values = headers.map(h => row[h] || '');
                    textOutput += values.join(' | ') + '\n';
                });

                resolve(textOutput);
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
}

/**
 * Parse Excel buffer to text
 */
async function parseExcel(buffer: Buffer): Promise<string> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let textOutput = '';

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as string[][];

        textOutput += `=== Sheet: ${sheetName} ===\n`;
        data.forEach(row => {
            if (Array.isArray(row) && row.some(cell => cell !== '')) {
                textOutput += row.join(' | ') + '\n';
            }
        });
        textOutput += '\n';
    });

    return textOutput;
}
