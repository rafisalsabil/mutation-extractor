const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Papa = require('papaparse');
const XLSX = require('xlsx');

/**
 * Parse file content based on file type
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
async function parseFile(filePath, mimeType) {
    const ext = path.extname(filePath).toLowerCase();

    if (mimeType === 'application/pdf' || ext === '.pdf') {
        return parsePDF(filePath);
    } else if (mimeType === 'text/csv' || ext === '.csv') {
        return parseCSV(filePath);
    } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel' ||
        ext === '.xlsx' ||
        ext === '.xls'
    ) {
        return parseExcel(filePath);
    } else {
        throw new Error(`Unsupported file type: ${mimeType || ext}`);
    }
}

/**
 * Extract text from PDF
 */
async function parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

/**
 * Parse CSV file to text
 */
async function parseCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const result = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
    });

    // Convert parsed data back to readable text for LLM
    if (result.data.length === 0) {
        return fileContent; // Return raw if parsing fails
    }

    const headers = Object.keys(result.data[0] || {});
    let textOutput = headers.join(' | ') + '\n';
    textOutput += '-'.repeat(50) + '\n';

    result.data.forEach(row => {
        const values = headers.map(h => row[h] || '');
        textOutput += values.join(' | ') + '\n';
    });

    return textOutput;
}

/**
 * Parse Excel file to text
 */
function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    let textOutput = '';

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

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

module.exports = { parseFile };
