// components/ProductCard.jsx

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { addToCart, getCart } from '../api';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await addToCart(user.userId, productId, quantity);
      
      // Update cart count
      const cartResponse = await getCart(user.userId);
      const totalItems = cartResponse.data.cart.reduce((sum, item) => sum + item.quantity, 0);
      updateCartCount(totalItems);
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">📦</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
        
        <div className="quantity-selector">
          <button onClick={decrementQuantity} className="qty-btn">
            <FiMinus />
          </button>
          <span className="quantity">{quantity}</span>
          <button onClick={incrementQuantity} className="qty-btn">
            <FiPlus />
          </button>
        </div>

        <button 
          onClick={handleAddToCart} 
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          disabled={loading}
        >
          <FiShoppingCart />
          {loading ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
