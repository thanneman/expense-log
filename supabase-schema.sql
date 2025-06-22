-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your auth needs)
CREATE POLICY "Allow all operations" ON expenses
  FOR ALL USING (true);

-- Insert some sample data (optional)
INSERT INTO expenses (title, amount, date, category, note) VALUES
  ('Grocery Shopping', 85.50, '2024-01-15', 'Food & Dining', 'Weekly groceries from Whole Foods'),
  ('Gas Station', 45.00, '2024-01-14', 'Transportation', 'Full tank fill-up'),
  ('Netflix Subscription', 15.99, '2024-01-13', 'Entertainment', 'Monthly subscription'),
  ('Electric Bill', 120.75, '2024-01-12', 'Utilities', 'December electricity bill'),
  ('Coffee Shop', 4.50, '2024-01-11', 'Food & Dining', 'Morning coffee')
ON CONFLICT DO NOTHING; 