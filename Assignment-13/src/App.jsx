import { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import { fetchProducts } from "./services/productService";
import {
  fetchCart,
  addToCart,
  setQuantity,
  removeFromCart,
} from "./services/cartService";

function StoreApp() {
  const { user, logout } = useAuth();

  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products + this user's cart once, on login
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const [productList, cart] = await Promise.all([
          fetchProducts(),
          fetchCart(user.id),
        ]);
        if (!cancelled) {
          setProducts(productList);
          setCartItems(cart);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  // Re-fetch just the cart after any mutation, so quantities/ids stay correct
  async function refreshCart() {
    const cart = await fetchCart(user.id);
    setCartItems(cart);
  }

  const handleAddToCart = async (product) => {
    try {
      await addToCart(user.id, product);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleIncrease = async (cartItemId) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item || item.quantity >= item.maxQty) return;
    try {
      await setQuantity(cartItemId, item.quantity + 1);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDecrease = async (cartItemId) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    try {
      await setQuantity(cartItemId, item.quantity - 1);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const visibleProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return <p className="loading-state">Loading your store...</p>;
  }

  return (
    <>
      <Navbar cartCount={cartCount} userEmail={user.email} onLogout={logout} />

      <section id="description">
        <h2>Welcome to MyStore</h2>
        <p>
          We sell everyday essentials — electronics, home goods, stationery, and
          accessories, all in one place.
        </p>
      </section>

      {error && <p className="login-error">{error}</p>}

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <ProductList
        products={visibleProducts}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

      <div id="cart">
        <Cart
          cartItems={cartItems.map((item) => ({
            ...item,
            id: item.cartItemId, // Cart/CartItem use `id` for increase/decrease/remove callbacks
          }))}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      </div>
    </>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="loading-state">Loading...</p>;

  return user ? <StoreApp /> : <Login />;
}

export default App;
