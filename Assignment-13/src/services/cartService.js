import { supabase } from "../supabaseClient";
// remember - supabase retunn promise 
export async function fetchCart(userId) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(*)")
    .eq("user_id", userId);

  if (error) throw error;


  return data.map((row) => ({
    cartItemId: row.id,
    id: row.product.id,
    name: row.product.name,
    price: row.product.price,
    image: row.product.image,
    category: row.product.category,
    maxQty: row.product.max_qty,
    quantity: row.quantity,
  }));
}

export async function addToCart(userId, product) {
  const { data: existing, error: fetchError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", product.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    if (existing.quantity >= product.maxQty) return; // already at max
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: product.id, quantity: 1 });
    if (error) throw error;
  }
}

export async function setQuantity(cartItemId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);
  if (error) throw error;
}

export async function removeFromCart(cartItemId) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);
  if (error) throw error;
}
