/*
  # Fix Customers and Suppliers RLS Policies

  1. Changes
    - Add INSERT policies for authenticated users on customers table
    - Add INSERT policies for authenticated users on suppliers table
    
  2. Security
    - All authenticated users can insert customers and suppliers
    - Existing role-based policies remain for full management
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'customers' 
    AND policyname = 'Authenticated users can insert customers'
  ) THEN
    CREATE POLICY "Authenticated users can insert customers"
      ON customers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suppliers' 
    AND policyname = 'Authenticated users can insert suppliers'
  ) THEN
    CREATE POLICY "Authenticated users can insert suppliers"
      ON suppliers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
