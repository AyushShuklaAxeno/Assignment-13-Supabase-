import Button from "./Button";

export default function Navbar({ cartCount, userEmail, onLogout, onLoginClick }) {
    return (
        <nav className="navbar" id="top">
            <a href="#top">🛒 MyStore</a>
            <div>
                <a href="#description">Product Description</a>
                {/* <a href="#products">All Products</a> */}

                {userEmail ? (
                    <>
                        <a href="#cart">Cart ({cartCount})</a>
                        <span className="navbar-user">{userEmail}</span>
                        <Button label="Logout" onClick={onLogout} variant="outline" />
                    </>
                ) : (
                    <Button label="Login" onClick={onLoginClick} variant="primary" />
                )}
            </div>
        </nav>
    );
}