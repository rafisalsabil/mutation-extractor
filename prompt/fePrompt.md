# Frontend Prompt — Bank Mutation Extractor (MVP)

Build a clean, modern, responsive web app UI for a simple product that extracts bank mutation data from an uploaded file, then redirects user to a dashboard showing summary stats and extraction results.

## Product Name
**Mutation Extractor**

## Tech/Style Requirements
- Responsive (desktop-first, works on mobile)
- Clean corporate look, minimal, lots of whitespace
- Use a simple design system: consistent spacing, rounded cards, subtle shadows
- Provide: Loading states, empty states, error states
- Support light mode (dark mode optional)

---

## Pages & Routes

### 1) Upload Page (`/`)
Goal: user uploads a file, sees extraction progress, then is redirected to dashboard on success.

#### Layout
- Header: left logo "Mutation Extractor", right nav button: "Dashboard" (disabled until extraction exists)
- Main centered card:
  - Title: "Upload Bank Mutation File"
  - Subtitle: "Upload your mutation statement to extract structured transactions."
  - Upload area (drag & drop + browse):
    - Accept: PDF, CSV, XLSX (show as helper text)
    - Show file name, size, and remove button after selection
  - Primary CTA button: **Extract Mutation**
  - Secondary link/button: “Use sample file”

#### States
- **Empty state**: no file selected
- **Uploading/Extracting state**:
  - Progress indicator (stepper):
    1. Uploading
    2. Extracting
    3. Validating
    4. Done
  - Skeleton placeholder for “Detected Banks / Rows”
- **Success state**:
  - Inline success banner: “Extraction complete”
  - Auto redirect to `/dashboard` after 1–2 seconds (also show a button “Go to Dashboard”)
- **Error state**:
  - Error banner with retry button
  - Show common error hints: “Unsupported file”, “Low-quality scan”, “No transactions detected”

---

### 2) Dashboard Page (`/dashboard`)
Goal: show 4 metric cards + charts + extraction result table.

#### Top Section
- Page title: **Dashboard**
- Subtext: show last extraction info (e.g., “Last extracted: Today 14:22”)
- Top right actions:
  - Button: **Upload New File**
  - Button: **Export CSV** (disabled if no data)

#### Section A — 4 Summary Cards (in a grid)
Card 1: **Total Transactions**
- Big number (count)
- Small delta text (optional): “from last upload” (if no comparison, hide)

Card 2: **Net Amount**
- Big number (Credit - Debit)
- Small helper: “Credit minus Debit”

Card 3: **Total Credit**
- Big number
- Badge: “Credit”

Card 4: **Total Debit**
- Big number
- Badge: “Debit”

Include skeleton loading for cards when data is loading.

#### Section B — Charts (2-column grid)
Chart 1 (left): **Donut Chart — Share of Transactions by Bank**
- Labels: bank names
- Tooltip: bank name + count + %
- Legend on right or bottom

Chart 2 (right): **Stacked Bar — Credit vs Debit by Bank**
- X: bank name
- Y: amount
- Stacks: Credit, Debit
- Tooltip shows both values

Below charts (full width):
Chart 3: **Top 10 Largest Transactions (Bar/List)**
- Sorted descending by absolute amount
- Show bank + type + amount
- Provide a toggle: “Credit only / Debit only / All”

> If charting library is not available, use clean placeholder blocks with titles + empty state copy.

#### Section C — Extraction Results Table
Title: **Extracted Transactions**
Controls row above table:
- Search input (search by bank)
- Filter dropdown: Bank (multi-select, includes auto-detected banks)
- Filter dropdown: Type (All / Credit / Debit)
- Sort: Amount (High→Low, Low→High)

Table columns (exact):
1. **No**
2. **Bank Mutation From**
3. **Amount**
4. **Mutation Type** (Credit/Debit)

Table behaviors:
- Sticky header
- Pagination (10/25/50)
- Row hover highlight
- Amount formatting as currency
- Mutation Type shown as a pill badge (Credit / Debit)
- Empty state: “No transactions found. Upload a file to start.”

Row click behavior (optional, nice-to-have):
- Opens a side panel (drawer) with transaction details (bank, type, amount, row id)

---

## Data Model (Frontend Mock)
Use mock data for now and wire the UI as if these objects come from an API.

Example:
- `extractionSummary`:
  - totalTransactions: number
  - totalCredit: number
  - totalDebit: number
  - netAmount: number
  - banks: array of { name: string, txCount: number, creditAmount: number, debitAmount: number }

- `transactions` array rows:
  - no: number
  - bank: string
  - amount: number
  - type: "Credit" | "Debit"

Include at least:
- 3 banks (Mandiri, BCA, BNI)
- 15 sample transactions with mixed credit/debit

---

## UX Notes
- Redirect logic: after successful extraction on Upload page, navigate to `/dashboard`.
- Persist last extraction in local storage for MVP so refreshing dashboard still shows data.
- Make everything feel “enterprise-ready” but still simple.

---

## Deliverable
Produce the full UI implementation for:
- Upload page
- Dashboard page
- Reusable components: Header, Card, ChartContainer, Table, EmptyState, LoadingSkeleton
- Include mock data + state management for loading/success/error
