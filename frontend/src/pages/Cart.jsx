// pages/Cart.jsx - Shopping Cart Page

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getCart, removeFromCart, createOrder } from '../api';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await getCart(user.userId);
      setCart(response.data.cart);
      setTotal(response.data.total);
      updateCartCount(response.data.cart.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate, updateCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(user.userId, productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      await createOrder(user.userId);
      setOrderSuccess(true);
      setCart([]);
      setTotal(0);
      updateCartCount(0);
      
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-success">
        <div className="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been placed with Cash on Delivery</p>
        <p>Redirecting to orders...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button onClick={() => navigate('/')} className="back-btn">
            <FiArrowLeft /> Continue Shopping
          </button>
          <h1><FiShoppingBag /> Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button onClick={() => navigate('/')} className="shop-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="item-image">📦</div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <div className="item-subtotal">
                    ₹{item.subtotal.toLocaleString()}
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="remove-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="payment-info">
                <span>💵 Payment: Cash on Delivery (COD)</span>
              </div>
              <button 
                onClick={handlePlaceOrder} 
                className="checkout-btn"
                disabled={orderLoading}
              >
                {orderLoading ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
