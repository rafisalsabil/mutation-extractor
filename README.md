# Mutation Extractor

A modern web application for extracting and analyzing bank mutation data from PDF, CSV, and Excel files using OpenAI GPT models.

## Features

- 📄 **Multi-format Support**: Upload PDF, CSV, or Excel bank statements
- 🤖 **AI-Powered Extraction**: Uses OpenAI GPT-4o-mini for intelligent transaction parsing
- 📊 **Interactive Dashboard**: View summary statistics, charts, and filterable transaction tables
- 💾 **Export Functionality**: Download extracted data as CSV
- 🎨 **Modern UI**: Clean, elegant design optimized for financial data

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide React Icons

### Backend
- Node.js / Express
- OpenAI API
- PDF/CSV/Excel parsers
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rafisalsabil/mutation-extractor.git
cd mutation-extractor
```

2. Install frontend dependencies:
```bash
cd web
npm install
```

3. Install backend dependencies:
```bash
cd ../api
npm install
```

4. Set up environment variables:
```bash
cd api
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Running the Application

1. Start the backend server:
```bash
cd api
npm run dev
```

Backend runs at: `http://localhost:3002`

2. In a new terminal, start the frontend:
```bash
cd web
npm run dev
```

Frontend runs at: `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Upload**: Drag and drop or select a bank mutation file (PDF, CSV, or Excel)
2. **Extract**: Click "Extract Mutation" to process the file
3. **View**: See extracted transactions, statistics, and charts on the dashboard
4. **Export**: Download the results as CSV for further analysis

## Project Structure

```
mutation-extractor/
├── api/                    # Backend API
│   ├── services/          # File parsing and extraction logic
│   ├── prompts/           # OpenAI prompt templates
│   ├── server.js          # Express server
│   └── package.json
├── web/                    # Frontend Next.js app
│   ├── app/               # Pages and layouts
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities and API client
│   └── package.json
└── prompt/                 # Design specifications
```

## Environment Variables

### Backend (`api/.env`)
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3002)
- `MAX_FILE_SIZE_MB`: Maximum file size in MB (default: 5)
- `OPENAI_MODEL`: OpenAI model to use (default: gpt-4o-mini)

### Frontend (`web/.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3002)

## License

MIT

## Author

Built with ❤️ using Next.js, Express, and OpenAI
