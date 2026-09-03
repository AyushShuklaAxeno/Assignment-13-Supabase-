import { useState } from "react";
import CartItem from "./CartItem";
import EmptyState from "./EmptyState";
import Button from "./Button";

export default function Cart({ cartItems, onIncrease, onDecrease, onRemove }) {
    const [discountCode, setDiscountCode] = useState("");
    const [discountError, setDiscountError] = useState("");

    const [discountApplied, setDiscountApplied] = useState(() => {
        try {
            return localStorage.getItem("discountApplied") === "true";
        } catch {
            return false;
        }
    });
    // localStorage can throw runtime exceptions in restricted environments (such as Safari Incognito mode, embedded webviews, or some environments where window isn't defined yet, so try catch is safty net

    function updateDiscount(applied) {
        setDiscountApplied(applied);
        localStorage.setItem("discountApplied", applied.toString());
    }

    if (cartItems.length === 0 && (discountApplied || discountCode)) {
        updateDiscount(false);
        setDiscountCode("");
        setDiscountError("");
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = discountApplied ? subtotal * 0.9 : subtotal;

    const handleApplyDiscount = () => {
        if (discountCode.trim().toUpperCase() === "SAVE10") {
            updateDiscount(true);
            setDiscountError("");
        } else {
            updateDiscount(false);
            setDiscountError("Invalid code");
        }
    };

    return (
        <div className="cart-container">
            <h3>Shopping Cart</h3>
            {cartItems.length === 0 ? (
                <EmptyState message="Your cart is empty" />
            ) : (
                <>
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                maxQty={item.maxQty}
                                onIncrease={() => onIncrease(item.id)}
                                onDecrease={() => onDecrease(item.id)}
                                onRemove={() => onRemove(item.id)}
                            />
                        ))}
                    </div>

                    <div className="discount-bar">
                        <input
                            type="text"
                            placeholder="Discount code (try SAVE10)"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                        />
                        <Button label="Apply" onClick={handleApplyDiscount} variant="outline" />
                        {discountError && <p className="discount-error">{discountError}</p>}
                        {discountApplied && <p className="discount-success">10% discount applied!</p>}
                    </div>

                    <div className="cart-summary">
                        {discountApplied && (
                            <p className="cart-subtotal">Subtotal: ₹{subtotal.toFixed(2)}</p>
                        )}
                        <h4>Total: ₹{total.toFixed(2)}</h4>
                    </div>
                </>
            )}
        </div>
    );
}