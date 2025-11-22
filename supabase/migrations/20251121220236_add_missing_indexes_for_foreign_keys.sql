/*
  # Add Missing Indexes for Foreign Keys

  1. Changes
    - Add index for customer_interactions.created_by
    - Add index for orders.created_by
    - Add index for stock_movements.created_by
    
  2. Performance
    - These indexes improve query performance for foreign key lookups
    - Required for optimal join performance
*/

CREATE INDEX IF NOT EXISTS idx_customer_interactions_created_by 
  ON customer_interactions(created_by);

CREATE INDEX IF NOT EXISTS idx_orders_created_by 
  ON orders(created_by);

CREATE INDEX IF NOT EXISTS idx_stock_movements_created_by 
  ON stock_movements(created_by);
