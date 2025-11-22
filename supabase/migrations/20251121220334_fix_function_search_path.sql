/*
  # Fix Function Search Path

  1. Changes
    - Set immutable search_path for update_updated_at_column function
    - This prevents security issues from mutable search paths
    
  2. Security
    - Ensures function always uses correct schema
    - Prevents potential schema injection attacks
*/

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
