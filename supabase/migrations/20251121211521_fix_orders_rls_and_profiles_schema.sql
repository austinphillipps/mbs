/*
  # Fix Orders RLS Policy and Profiles Schema

  1. Changes
    - Add INSERT policy for authenticated users on orders table
    - Add company_name column to profiles table if it doesn't exist
    
  2. Security
    - All authenticated users can insert orders
    - Existing role-based policies remain for full management
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Authenticated users can insert orders'
  ) THEN
    CREATE POLICY "Authenticated users can insert orders"
      ON orders
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company_name text;
  END IF;
END $$;
