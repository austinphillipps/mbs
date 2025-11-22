/*
  # Remove Unused Indexes

  1. Changes
    - Remove indexes that have not been used
    - These indexes consume storage and slow down write operations
    - Indexes can be recreated later if query patterns change
    
  2. Indexes Removed
    - Products: category, supplier, sku indexes
    - Inventory: product index
    - Customers: assigned_to index
    - Orders: customer, status, created_by indexes
    - Order Items: order, product indexes
    - Stock Movements: product, created_by indexes
    - Customer Interactions: customer, created_by indexes
    - Notifications: read index
    - Contacts: status index
*/

DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_supplier;
DROP INDEX IF EXISTS idx_products_sku;
DROP INDEX IF EXISTS idx_inventory_product;
DROP INDEX IF EXISTS idx_customers_assigned_to;
DROP INDEX IF EXISTS idx_orders_customer;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_order_items_product;
DROP INDEX IF EXISTS idx_stock_movements_product;
DROP INDEX IF EXISTS idx_customer_interactions_customer;
DROP INDEX IF EXISTS idx_notifications_read;
DROP INDEX IF EXISTS idx_contacts_status;
DROP INDEX IF EXISTS idx_customer_interactions_created_by;
DROP INDEX IF EXISTS idx_orders_created_by;
DROP INDEX IF EXISTS idx_stock_movements_created_by;
