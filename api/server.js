require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { parseFile } = require('./services/fileParser');
const { extractTransactions } = require('./services/extractionService');

const app = express();
const PORT = process.env.PORT || 3002;

// CORS configuration for Next.js frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        const allowedExts = ['.pdf', '.csv', '.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type. Please upload PDF, CSV, or Excel files.'));
        }
    },
});

// In-memory storage for extraction results (for MVP)
const extractions = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Upload and extract endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const startTime = Date.now();

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractionId = uuidv4();
    const filePath = req.file.path;

    try {
        // Store initial status
        extractions.set(extractionId, {
            id: extractionId,
            status: 'processing',
            fileName: req.file.originalname,
            startedAt: new Date().toISOString(),
        });

        console.log(`[${extractionId}] Processing file: ${req.file.originalname}`);

        // Parse file content
        console.log(`[${extractionId}] Parsing file...`);
        const fileContent = await parseFile(filePath, req.file.mimetype);

        if (!fileContent || fileContent.trim().length === 0) {
            throw new Error('Could not extract any text from the file. Please ensure the file contains readable content.');
        }

        console.log(`[${extractionId}] File parsed, content length: ${fileContent.length} chars`);

        // Extract transactions using OpenAI
        console.log(`[${extractionId}] Calling OpenAI for extraction...`);
        const result = await extractTransactions(fileContent, req.file.originalname);

        const processingTime = Date.now() - startTime;
        console.log(`[${extractionId}] Extraction complete in ${processingTime}ms`);

        // Store result
        extractions.set(extractionId, {
            id: extractionId,
            status: 'completed',
            fileName: req.file.originalname,
            startedAt: extractions.get(extractionId).startedAt,
            completedAt: new Date().toISOString(),
            processingTimeMs: processingTime,
            result,
        });

        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });

        res.json({
            id: extractionId,
            status: 'completed',
            processingTimeMs: processingTime,
            result,
        });

    } catch (error) {
        console.error(`[${extractionId}] Extraction error:`, error);

        // Store error status
        extractions.set(extractionId, {
            id: extractionId,
            status: 'failed',
            fileName: req.file.originalname,
            error: error.message,
        });

        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });

        res.status(500).json({
            id: extractionId,
            status: 'failed',
            error: error.message,
        });
    }
});

// Get extraction status/result
app.get('/api/extraction/:id', (req, res) => {
    const extraction = extractions.get(req.params.id);

    if (!extraction) {
        return res.status(404).json({ error: 'Extraction not found' });
    }

    res.json(extraction);
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB`,
            });
        }
    }

    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Mutation Extractor API running on http://localhost:${PORT}`);
    console.log(`📁 Max file size: ${process.env.MAX_FILE_SIZE_MB || 5}MB`);
    console.log(`🤖 OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
});
