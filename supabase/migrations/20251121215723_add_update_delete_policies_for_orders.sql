/*
  # Add UPDATE and DELETE policies for orders and order_items

  1. Changes
    - Add UPDATE policy for authenticated users on orders table
    - Add DELETE policy for authenticated users on orders table
    - Add INSERT policy for authenticated users on order_items table
    - Add UPDATE policy for authenticated users on order_items table
    - Add DELETE policy for authenticated users on order_items table
    
  2. Security
    - All authenticated users can update, delete orders and manage order items
    - Existing role-based policies remain for full management
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Authenticated users can update orders'
  ) THEN
    CREATE POLICY "Authenticated users can update orders"
      ON orders
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Authenticated users can delete orders'
  ) THEN
    CREATE POLICY "Authenticated users can delete orders"
      ON orders
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Authenticated users can insert order items'
  ) THEN
    CREATE POLICY "Authenticated users can insert order items"
      ON order_items
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Authenticated users can update order items'
  ) THEN
    CREATE POLICY "Authenticated users can update order items"
      ON order_items
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Authenticated users can delete order items'
  ) THEN
    CREATE POLICY "Authenticated users can delete order items"
      ON order_items
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;
