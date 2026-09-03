import Button from "./Button";

export default function CartItem({ name, price, quantity, maxQty, onIncrease, onDecrease, onRemove }) {
    const subtotal = price * quantity;
    const isMaxed = quantity >= maxQty;

    return (
        <div className="cart-item">
            <div className="cart-item-details">
                <h4>{name}</h4>
                <p>₹{price} × {quantity} = <strong>₹{subtotal.toFixed(2)}</strong></p>
            </div>
            <div className="cart-item-controls">
                <Button label="-" onClick={onDecrease} variant="secondary" />
                <span>{quantity}</span>
                <Button
                    label="+"
                    onClick={onIncrease}
                    variant="secondary"
                    disabled={isMaxed}
                />
                <Button label="Remove" onClick={onRemove} variant="danger" />
                {isMaxed && <span className="max-qty-note">Max reached</span>}
            </div>
        </div>
    );
}