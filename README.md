# Expense Log

A modern expense tracking application built with Next.js, TypeScript, and Supabase. Track your expenses, analyze spending patterns, and master your budget with a clean, intuitive interface.

## Features

- ✨ **Add Expenses**: Easily record new expenses with categories and notes
- 📊 **View History**: Browse, search, and filter your expense history
- 📈 **Real-time Stats**: See total expenses, transaction count, and monthly averages
- 🎨 **Modern UI**: Beautiful, responsive design
- 🔍 **Advanced Filtering**: Filter by date range, category, and search terms
- 📱 **Mobile Friendly**: Optimized for all device sizes
- 🏷️ **Category Management**: Create, edit, and manage expense categories with custom colors

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React hooks with custom useExpenses and useCategories hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone git@github.com:thanneman/expense-log.git
cd expense-log
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) to create your database
   - Create a `.env.local` file with your Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses two main tables: `expenses` and `categories`.

### Expenses Table

```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  category TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

The categories table includes:
- **Default categories** with predefined colors
- **Foreign key relationship** with expenses table
- **Automatic timestamps** for created_at and updated_at
- **Row Level Security (RLS)** enabled
- **Protection against deletion** of categories in use

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── category-badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── tooltip.tsx
│   ├── app-sidebar.tsx
│   ├── edit-expense-form.tsx
│   ├── expense-table.tsx
│   └── layout.tsx
├── hooks/              # Custom React hooks
│   ├── use-categories.ts
│   ├── use-expenses.ts
│   └── use-mobile.ts
├── lib/                # Utilities and configurations
│   ├── category-api.ts # Category API utilities
│   ├── category-colors.ts
│   ├── config.ts       # App configuration
│   ├── expense-api.ts  # Expense API utilities
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # General utilities
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # Document wrapper
│   ├── categories.tsx  # Categories management page
│   ├── history.tsx     # Expense history page
│   ├── index.tsx       # Home page
│   └── new.tsx         # Add expense page
└── styles/             # Global styles
    └── globals.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Roadmap

- [ ] User authentication and multi-user support
- [ ] Data export functionality (CSV, PDF)
- [ ] Budget tracking and alerts
- [ ] Recurring expenses
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)