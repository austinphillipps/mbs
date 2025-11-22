/*
  # Add subtotal column to order_items table

  1. Changes
    - Add subtotal column to order_items table if it doesn't exist
    
  2. Notes
    - Default value is 0
    - This column stores the calculated line total (quantity * unit_price)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE order_items ADD COLUMN subtotal numeric DEFAULT 0;
  END IF;
END $$;
