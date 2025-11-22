import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'sales' | 'warehouse';
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  payment_terms?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category_id?: string;
  supplier_id?: string;
  unit_type: 'bottle' | 'case' | 'pallet';
  units_per_case: number;
  cost_price: number;
  selling_price: number;
  min_stock_level: number;
  max_stock_level: number;
  barcode?: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Inventory = {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  last_counted_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  company_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country: string;
  tax_id?: string;
  payment_terms: string;
  credit_limit: number;
  customer_type: 'restaurant' | 'hotel' | 'bar' | 'retail' | 'other';
  assigned_to?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string;
  order_date: string;
  delivery_date?: string;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_rate: number;
  line_total: number;
  created_at: string;
};

export type StockMovement = {
  id: string;
  product_id: string;
  movement_type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
};

export type CustomerInteraction = {
  id: string;
  customer_id: string;
  interaction_type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  description?: string;
  interaction_date: string;
  follow_up_date?: string;
  created_by?: string;
  created_at: string;
};
