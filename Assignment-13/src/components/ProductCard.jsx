import Button from "./Button"
import Badge from "./Badge"

export default function ProductCard({ name, price, image, category, inCart, onAddToCart }) {
    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image" />
            <h3 className="product-title">{name}</h3>
            <p className="product-price">₹{price}</p>
            <Badge text={category} variant="secondary" />
            <Button 
                label={inCart ? "Added ✓" : "Add to Cart"} 
                onClick={onAddToCart} 
                variant={inCart ? "secondary" : "primary"} 
            />
        </div>
    )
}