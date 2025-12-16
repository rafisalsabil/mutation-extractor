This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

App runs at: `http://localhost:3000`

## Deployment to Vercel

1. Push this repository to GitHub.
2. Login to Vercel and "Add New Project".
3. Import the `mutation-extractor` repository.
4. **Environment Variables**: Add `OPENAI_API_KEY` in the Vercel project settings.
5. Deploy!

## Project Structure

```
mutation-extractor/
├── app/               # Next.js App Router
│   ├── api/           # API Routes (Serverless)
│   └── ...
├── components/        # UI Components
├── lib/               # Utilities & Server Services
└── public/            # Static assets
```
