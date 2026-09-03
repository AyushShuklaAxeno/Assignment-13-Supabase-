-- schrema used to create tables in the suapbase DB

-- product table
create table if not exists products (
  id          bigint generated always as identity primary key,
  name        text not null,
  price       numeric(10, 2) not null,
  image       text,
  category    text,
  max_qty     integer not null default 5,
  created_at  timestamptz default now()
);

-- cart items table 
create table if not exists cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  product_id  bigint not null references products (id) on delete cascade,
  quantity    integer not null default 1 check (quantity > 0),
  created_at  timestamptz default now(),
  unique (user_id, product_id)   -- one row per product per customer
);

--  row level security 
alter table products enable row level security;
alter table cart_items enable row level security;

--  product policy -- everyone (any logged-in user) can read the catalog
create policy "Anyone can view products"
on products for select
using ( true );

-- cart items policies  -- a customer can only touch their own rows
create policy "Users can view own cart"
on cart_items for select
using ( auth.uid() = user_id );

create policy "Users can insert own cart items"
on cart_items for insert
with check ( auth.uid() = user_id );

create policy "Users can update own cart items"
on cart_items for update
using ( auth.uid() = user_id );

create policy "Users can delete own cart items"
on cart_items for delete
using ( auth.uid() = user_id );

-- 6. mock data for products db insertino
insert into products (name, price, image, category, max_qty) values
('Wireless Mouse', 799, 'https://images.unsplash.com/photo-1721744179382-0f8b0f19789e?q=80&w=1074&auto=format&fit=crop', 'Electronics', 5),
('Coffee Mug', 249, 'https://plus.unsplash.com/premium_photo-1717586678487-ae60e31b28f7?q=80&w=687&auto=format&fit=crop', 'Home', 10),
('Bluetooth Headphones', 1999, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop', 'Electronics', 3),
('Smart Watch', 3499, 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop', 'Electronics', 4),
('Cotton T-Shirt', 599, 'https://images.unsplash.com/photo-1651761179569-4ba2aa054997?q=80&w=1170&auto=format&fit=crop', 'Fashion', 8),
('Running Shoes', 2499, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1025&auto=format&fit=crop', 'Fashion', 3),
('Laptop Backpack', 1299, 'https://images.unsplash.com/photo-1667411424771-cadd97150827?q=80&w=1170&auto=format&fit=crop', 'Accessories', 5),
('Mechanical Keyboard', 2799, 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=1332&auto=format&fit=crop', 'Electronics', 4),
('Desk Lamp', 899, 'https://images.unsplash.com/photo-1570974802254-4b0ad1a755f5?q=80&w=1170&auto=format&fit=crop', 'Home', 6),
('Water Bottle', 399, 'https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3?q=80&w=1332&auto=format&fit=crop', 'Home', 10);
