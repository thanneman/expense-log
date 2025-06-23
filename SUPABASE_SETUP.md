# Supabase Setup Instructions

This guide will help you set up Supabase as the database for your expense tracker application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in to your account
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "expense-log")
5. Enter a database password (save this for later)
6. Choose a region close to you
7. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 2.

## 4. Set Up the Database Schema

### Step 4a: Create the Expenses Table

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click "Run"

This will create:
- The `expenses` table with all necessary columns
- Indexes for better performance
- A trigger to automatically update timestamps
- Row Level Security (RLS) policies
- Sample data (optional)

### Step 4b: Create the Categories Table

1. In the SQL Editor, copy the contents of `supabase-categories-schema.sql` from this project
2. Paste it into the SQL Editor and click "Run"

This will create:
- The `categories` table with name and color fields
- Default categories with predefined colors
- Foreign key relationship with the expenses table
- Automatic timestamps and triggers
- Row Level Security (RLS) policies
- Protection against deletion of categories in use

### Database Schema Overview

Your database will now have two main tables:

**Expenses Table:**
- `id` - Unique identifier
- `title` - Expense description
- `amount` - Expense amount (decimal)
- `date` - Date of expense
- `category` - Category name (text)
- `category_id` - Foreign key to categories table
- `note` - Optional notes
- `created_at` / `updated_at` - Timestamps

**Categories Table:**
- `id` - Unique identifier
- `name` - Category name (unique)
- `color` - Hex color code for UI display
- `created_at` / `updated_at` - Timestamps

## 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your application
3. Try adding a new expense with a category
4. Visit the categories page to manage categories
5. Check the history page to see if data is being saved and retrieved

## 6. Verify Data in Supabase

1. In your Supabase dashboard, go to Table Editor
2. You should see both `expenses` and `categories` tables
3. Check that default categories were created
4. Verify that expenses you've added through the application appear in the expenses table

## Troubleshooting

### Environment Variables Not Working
- Make sure your `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check that the variable names match exactly

### Database Connection Issues
- Verify your Supabase URL and API key are correct
- Check that your Supabase project is active
- Ensure both `expenses` and `categories` tables were created successfully

### Categories Not Loading
- Check that the categories table was created with default data
- Verify the foreign key relationship between expenses and categories
- Ensure RLS policies are properly configured

### RLS (Row Level Security) Issues
- If you're getting permission errors, check the RLS policies in the SQL Editor
- The default policies allow all operations, but you may want to customize them for production

## Security Considerations

For production use, consider:
- Implementing proper authentication
- Customizing RLS policies based on user roles
- Using environment-specific API keys
- Setting up proper CORS policies
- Adding user-specific data isolation

## Next Steps

Once the basic setup is working, you can:
- Add user authentication and multi-user support
- Implement more advanced filtering and search
- Add data export functionality (CSV, PDF)
- Set up automated backups
- Add real-time subscriptions for live updates
- Implement budget tracking and alerts 