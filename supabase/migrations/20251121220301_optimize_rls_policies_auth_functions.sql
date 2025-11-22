/*
  # Optimize RLS Policies with Auth Function Calls

  1. Changes
    - Replace auth.uid() with (SELECT auth.uid()) in all RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale
    
  2. Tables Updated
    - profiles
    - categories
    - suppliers
    - products
    - inventory
    - customers
    - orders
    - order_items
    - stock_movements
    - customer_interactions
    - notifications
*/

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Managers and admins can manage suppliers" ON suppliers;
CREATE POLICY "Managers and admins can manage suppliers"
  ON suppliers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Managers and admins can manage products" ON products;
CREATE POLICY "Managers and admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager')
    )
  );

DROP POLICY IF EXISTS "Warehouse, managers and admins can manage inventory" ON inventory;
CREATE POLICY "Warehouse, managers and admins can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'warehouse')
    )
  );

DROP POLICY IF EXISTS "Sales, managers and admins can manage customers" ON customers;
CREATE POLICY "Sales, managers and admins can manage customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'sales')
    )
  );

DROP POLICY IF EXISTS "Sales, managers and admins can manage orders" ON orders;
CREATE POLICY "Sales, managers and admins can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'sales')
    )
  );

DROP POLICY IF EXISTS "Sales, managers and admins can manage order items" ON order_items;
CREATE POLICY "Sales, managers and admins can manage order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'sales')
    )
  );

DROP POLICY IF EXISTS "Warehouse, managers and admins can create stock movements" ON stock_movements;
CREATE POLICY "Warehouse, managers and admins can create stock movements"
  ON stock_movements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'warehouse')
    )
  );

DROP POLICY IF EXISTS "Sales, managers and admins can manage interactions" ON customer_interactions;
CREATE POLICY "Sales, managers and admins can manage interactions"
  ON customer_interactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'manager', 'sales')
    )
  );

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
