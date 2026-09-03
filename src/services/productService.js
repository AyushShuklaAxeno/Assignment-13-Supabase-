import { supabase } from "../supabaseClient";

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) throw error;

  // maping DB snake_case -> the camelCase shape the UI already expects
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    maxQty: p.max_qty,
  }));
}
