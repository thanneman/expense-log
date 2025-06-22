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

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click "Run"

This will create:
- The `expenses` table with all necessary columns
- Indexes for better performance
- A trigger to automatically update timestamps
- Row Level Security (RLS) policies
- Sample data (optional)

## 5. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your application
3. Try adding a new expense
4. Check the history page to see if data is being saved and retrieved

## 6. Verify Data in Supabase

1. In your Supabase dashboard, go to Table Editor
2. Select the `expenses` table
3. You should see any expenses you've added through the application

## Troubleshooting

### Environment Variables Not Working
- Make sure your `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check that the variable names match exactly

### Database Connection Issues
- Verify your Supabase URL and API key are correct
- Check that your Supabase project is active
- Ensure the `expenses` table was created successfully

### RLS (Row Level Security) Issues
- If you're getting permission errors, check the RLS policies in the SQL Editor
- The default policy allows all operations, but you may want to customize it for production

## Security Considerations

For production use, consider:
- Implementing proper authentication
- Customizing RLS policies based on user roles
- Using environment-specific API keys
- Setting up proper CORS policies

## Next Steps

Once the basic setup is working, you can:
- Add user authentication
- Implement more advanced filtering and search
- Add data export functionality
- Set up automated backups
- Add real-time subscriptions for live updates 