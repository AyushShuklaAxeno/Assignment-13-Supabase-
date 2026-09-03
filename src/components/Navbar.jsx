import Button from "./Button";

export default function Navbar({ cartCount, userEmail, onLogout }) {
    return (
        <nav className="navbar" id="top">
            <a href="#top">🛒 MyStore</a>
            <div>
                <a href="#description">Product Description</a>
                <a href="#products">All Products</a>
                <a href="#cart">Cart ({cartCount})</a>
                {userEmail && (
                    <span className="navbar-user">{userEmail}</span>
                )}
                {onLogout && (
                    <Button label="Logout" onClick={onLogout} variant="outline" />
                )}
            </div>
        </nav>
    );
}