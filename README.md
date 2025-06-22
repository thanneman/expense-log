# Expense Log

A modern expense tracking application built with Next.js, TypeScript, and Supabase. Track your expenses, analyze spending patterns, and master your budget with a clean, intuitive interface.

## Features

- ✨ **Add Expenses**: Easily record new expenses with categories and notes
- 📊 **View History**: Browse, search, and filter your expense history
- 📈 **Real-time Stats**: See total expenses, transaction count, and monthly averages
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🔍 **Advanced Filtering**: Filter by date range, category, and search terms
- 📱 **Mobile Friendly**: Optimized for all device sizes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React hooks with custom useExpenses hook

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

The application uses a single `expenses` table with the following structure:

```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── expense-table.tsx
│   ├── layout.tsx
│   └── app-sidebar.tsx
├── hooks/              # Custom React hooks
│   └── use-expenses.ts
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── expense-api.ts  # API utilities
│   ├── config.ts       # App configuration
│   └── category-colors.ts
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── new.tsx         # Add expense page
│   ├── history.tsx     # Expense history page
│   └── categories.tsx  # Categories page
└── styles/             # Global styles
    └── globals.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
2. Review the troubleshooting section in the setup guide
3. Open an issue on GitHub

## Roadmap

- [ ] User authentication and multi-user support
- [ ] Data export functionality (CSV, PDF)
- [ ] Budget tracking and alerts
- [ ] Recurring expenses
- [ ] Expense categories management
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
