# Style Reference — Mutation Extractor (Elegant & Enterprise)

This style guide defines the visual language for the Mutation Extractor MVP.
The goal is **clean, elegant, enterprise-ready**, and **trust-driven** — suitable for financial data products.

---

## 1. Design Principles
- **Clarity over decoration** — data first, visuals support understanding
- **Soft elegance** — no harsh contrasts, subtle shadows
- **Predictable layout** — consistent spacing and alignment
- **Calm finance tone** — confidence, stability, trust

---

## 2. Color Palette

### Primary
- **Primary Blue**: `#1F3A8A`
  - Used for primary buttons, key highlights, active states
- **Soft Blue**: `#E8EEFF`
  - Background tint for info cards, charts, hover states

### Neutral
- **Text Primary**: `#0F172A`
- **Text Secondary**: `#475569`
- **Border / Divider**: `#E5E7EB`
- **Surface Background**: `#FFFFFF`
- **Page Background**: `#F8FAFC`

### Semantic
- **Credit (Positive)**: `#16A34A`
- **Debit (Negative)**: `#DC2626`
- **Warning**: `#F59E0B`
- **Info**: `#2563EB`

> Avoid pure black and pure white to keep the UI soft and premium.

---

## 3. Typography

### Font Family
- Primary: **Inter**
- Fallback: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`

### Type Scale
- **Page Title**: 28px / Semibold
- **Section Title**: 20px / Semibold
- **Card Title**: 14px / Medium
- **Primary Metric**: 32–36px / Bold
- **Body Text**: 14–15px / Regular
- **Helper Text**: 12px / Regular

### Line Height
- Titles: 1.2–1.3
- Body: 1.6

---

## 4. Spacing System
Use an **8px grid system**.

Common spacing:
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

Page padding:
- Desktop: 32px
- Mobile: 16px

---

## 5. Layout & Surfaces

### Cards
- Background: `#FFFFFF`
- Border radius: **12px**
- Shadow:
  - `0 1px 2px rgba(0,0,0,0.04)`
  - `0 4px 12px rgba(0,0,0,0.06)`
- Padding: 20–24px

Use cards for:
- Metric summaries
- Upload container
- Chart containers
- Tables

---

## 6. Buttons

### Primary Button
- Background: `#1F3A8A`
- Text: `#FFFFFF`
- Radius: 10px
- Height: 44px
- Font: Medium
- Hover: slightly darker blue
- Disabled: opacity 0.5

### Secondary Button
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Text: `#1F3A8A`
- Hover: `#F1F5F9`

### Subtle / Ghost
- Text only, no border
- Used for “Upload new file”, “Export CSV”

---

## 7. Badges & Pills

### Mutation Type Badge
- **Credit**
  - BG: `#ECFDF5`
  - Text: `#16A34A`
- **Debit**
  - BG: `#FEF2F2`
  - Text: `#DC2626`

Rounded pill:
- Radius: 999px
- Padding: 4px 10px
- Font size: 12px

---

## 8. Tables

- Header background: `#F8FAFC`
- Header text: 12px / Medium / Uppercase
- Row height: 48px
- Row hover: `#F1F5F9`
- Zebra striping: optional, very subtle
- Amount column:
  - Right aligned
  - Credit = green text
  - Debit = red text

---

## 9. Charts

- Background: white card
- Grid lines: very light (`#E5E7EB`)
- Labels: muted gray (`#64748B`)
- Donut chart:
  - Use primary + soft variations
  - Avoid rainbow colors
- Tooltips:
  - White background
  - Soft shadow
  - Rounded corners (8px)

---

## 10. States

### Loading
- Skeleton loaders with subtle shimmer
- No spinners blocking the whole page

### Empty State
- Soft illustration or icon
- Copy example:
  > “No data yet. Upload a bank mutation file to get started.”

### Error State
- Soft red background
- Clear human-readable message
- Actionable retry CTA

---

## 11. Micro-Interactions
- Hover transitions: 150–200ms ease
- Button press: slight scale (0.98)
- Card hover: very subtle shadow increase
- Page transitions: fade / slide up

---

## 12. Overall Vibe Keywords
**Elegant · Trustworthy · Calm · Financial · Enterprise · Modern**

---

## 13. Inspiration Reference (non-visual)
- Stripe Dashboard
- Linear Analytics
- Vercel Admin
- Modern banking dashboards (no neon, no gradients)

---

## Final Note
If unsure between **fancy** and **clear**, always choose **clear**.
This product should feel like something a bank would trust on day one.
