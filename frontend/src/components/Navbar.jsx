// components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 ShopMCP
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Products</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="nav-link">
                <FiPackage /> Orders
              </Link>
              <div className="user-menu">
                <span className="user-name">
                  <FiUser /> {user.name}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link login-link">
              <FiUser /> Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
