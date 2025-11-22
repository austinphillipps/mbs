/*
  # Fix Inventory Table RLS Policy for INSERT

  1. Changes
    - Add separate INSERT policy for authenticated users to create inventory records
    - Keep existing policies for SELECT and ALL operations
    
  2. Security
    - All authenticated users can insert inventory records
    - Warehouse, managers and admins retain full control
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'inventory' 
    AND policyname = 'Authenticated users can insert inventory'
  ) THEN
    CREATE POLICY "Authenticated users can insert inventory"
      ON inventory
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
