-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for better performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_categories_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true);

-- Insert default categories
INSERT INTO categories (name, color) VALUES
  ('Food & Dining', '#EF4444'),
  ('Transportation', '#3B82F6'),
  ('Entertainment', '#8B5CF6'),
  ('Shopping', '#10B981'),
  ('Healthcare', '#F59E0B'),
  ('Utilities', '#06B6D4'),
  ('Housing', '#84CC16'),
  ('Education', '#EC4899'),
  ('Travel', '#F97316'),
  ('Personal Care', '#6366F1'),
  ('Insurance', '#14B8A6'),
  ('Investments', '#22C55E'),
  ('Gifts', '#A855F7'),
  ('Subscriptions', '#F43F5E'),
  ('Other', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint to expenses table to reference categories
-- First, let's add a category_id column to expenses if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'expenses' AND column_name = 'category_id') THEN
    ALTER TABLE expenses ADD COLUMN category_id UUID REFERENCES categories(id);
  END IF;
END $$;

-- Create function to check if category is being used before deletion
CREATE OR REPLACE FUNCTION check_category_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if category is being used in expenses table
  IF EXISTS (SELECT 1 FROM expenses WHERE category_id = OLD.id) THEN
    RAISE EXCEPTION 'Cannot delete category "%" because it is being used by existing expenses', OLD.name;
  END IF;
  
  RETURN OLD;
END;
$$ language 'plpgsql';

-- Create trigger to prevent deletion of categories in use
CREATE TRIGGER prevent_category_deletion
  BEFORE DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_usage(); 