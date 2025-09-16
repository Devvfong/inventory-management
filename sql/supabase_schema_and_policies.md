# Supabase Schema and RLS Policies

This file contains the SQL scripts to set up the database schema and Row Level Security (RLS) policies for the Inventory Management System.

## Setup Instructions

1. Copy and run these scripts in your Supabase SQL Editor
2. Run them in the order provided below
3. Make sure to enable RLS on all tables after creation

## 1. Enable Required Extensions

```sql
-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 2. Create Tables

### Suppliers Table
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(100),
    email VARCHAR(255),
    address TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    price DECIMAL(10,2) CHECK (price >= 0),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    note TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Create Indexes for Performance

```sql
-- Index for product SKU lookups
CREATE INDEX idx_products_sku ON products(sku);

-- Index for transactions by product
CREATE INDEX idx_transactions_product_id ON transactions(product_id);

-- Index for transactions by date
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Index for products by supplier
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
```

## 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

## 5. Create RLS Policies

### Suppliers Policies
```sql
-- Allow authenticated users to read all suppliers
CREATE POLICY "Authenticated users can read suppliers" ON suppliers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert suppliers (with created_by = user.id)
CREATE POLICY "Users can insert suppliers" ON suppliers
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own suppliers
CREATE POLICY "Users can update own suppliers" ON suppliers
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own suppliers
CREATE POLICY "Users can delete own suppliers" ON suppliers
    FOR DELETE USING (auth.uid() = created_by);
```

### Products Policies
```sql
-- Allow authenticated users to read all products
CREATE POLICY "Authenticated users can read products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert products (with created_by = user.id)
CREATE POLICY "Users can insert products" ON products
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own products
CREATE POLICY "Users can update own products" ON products
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own products
CREATE POLICY "Users can delete own products" ON products
    FOR DELETE USING (auth.uid() = created_by);
```

### Transactions Policies
```sql
-- Allow authenticated users to read all transactions
CREATE POLICY "Authenticated users can read transactions" ON transactions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert transactions (with created_by = user.id)
CREATE POLICY "Users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Transactions are typically read-only after creation, so no update/delete policies
```

## 6. Create Updated At Triggers

```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for suppliers
CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for products
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 7. Optional: Create Views for Better Data Access

```sql
-- View for products with supplier information
CREATE VIEW products_with_suppliers AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.quantity,
    p.price,
    p.created_at,
    p.updated_at,
    s.name as supplier_name,
    s.contact as supplier_contact,
    s.email as supplier_email
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id;

-- View for transactions with product information
CREATE VIEW transactions_with_products AS
SELECT 
    t.id,
    t.type,
    t.quantity,
    t.note,
    t.created_at,
    p.name as product_name,
    p.sku as product_sku,
    p.price as product_price
FROM transactions t
JOIN products p ON t.product_id = p.id;
```

## Notes

- All tables use UUID primary keys for better security and scalability
- RLS policies ensure users can only access their own data
- The `auth.users` table is provided by Supabase authentication
- Created_by fields automatically track which user created each record
- Timestamps are automatically managed with triggers
- Check constraints ensure data integrity (non-negative quantities and prices)
- Foreign key constraints maintain referential integrity