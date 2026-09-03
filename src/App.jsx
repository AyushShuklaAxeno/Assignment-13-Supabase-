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

function App() {
  const { user, loading: authLoading, logout } = useAuth();

  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // Products load for everyone, logged in or not
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setProductsLoading(false));
  }, []);

  // Cart only loads once a user is logged in; clears when they log out
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    fetchCart(user.id).then(setCartItems).catch((err) => setError(err.message));
  }, [user]);

  // Once login succeeds, drop the login screen automatically
  useEffect(() => {
    if (user) setShowLogin(false);
  }, [user]);

  async function refreshCart() {
    const cart = await fetchCart(user.id);
    setCartItems(cart);
  }

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowLogin(true); // guest clicked Add to Cart -> send to login
      return;
    }
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
    await setQuantity(cartItemId, item.quantity + 1);
    await refreshCart();
  };

  const handleDecrease = async (cartItemId) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    await setQuantity(cartItemId, item.quantity - 1);
    await refreshCart();
  };

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
    await refreshCart();
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const visibleProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      return 0;
    });

  if (authLoading || productsLoading) {
    return <p className="loading-state">Loading...</p>;
  }

  // Guest clicked "Add to Cart" or "Login" -> show login screen only
  if (!user && showLogin) {
    return <Login onBack={() => setShowLogin(false)} />;
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        userEmail={user?.email}
        onLogout={logout}
        onLoginClick={() => setShowLogin(true)}
      />

      <section id="description">
        <h2>Welcome to MyStore</h2>
        <p>Browse freely — log in only when you're ready to add items to your cart.</p>
      </section>

      {error && <p className="login-error">{error}</p>}

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
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

      {user && (
        <div id="cart">
          <Cart
            cartItems={cartItems.map((item) => ({ ...item, id: item.cartItemId }))}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        </div>
      )}
    </>
  );
}

export default App;