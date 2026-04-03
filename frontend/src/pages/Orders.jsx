// pages/Orders.jsx - Orders Page

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getOrders, getProducts } from '../api';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const [ordersRes, productsRes] = await Promise.all([
          getOrders(user.userId),
          getProducts()
        ]);
        setOrders(ordersRes.data.orders);
        setProducts(productsRes.data.products);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  const getProductName = (productId) => {
    return products[productId]?.name || `Product #${productId}`;
  };

  const getProductPrice = (productId) => {
    return products[productId]?.price || 0;
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, item) => {
      return total + (getProductPrice(item.product_id) * item.quantity);
    }, 0);
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <button onClick={() => navigate('/')} className="back-btn">
            <FiArrowLeft /> Back to Shopping
          </button>
          <h1><FiPackage /> Your Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <button onClick={() => navigate('/')} className="shop-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <span className="label">Order</span>
                    <span className="value">#{orders.length - index}</span>
                  </div>
                  <div className={`order-status ${order.status.toLowerCase().replace('_', '-')}`}>
                    {order.status === 'PLACED_COD' ? '💵 Cash on Delivery' : order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.order_details.map((item, itemIndex) => (
                    <div key={itemIndex} className="order-item">
                      <span className="item-emoji">📦</span>
                      <div className="item-info">
                        <span className="item-name">{getProductName(item.product_id)}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">
                        ₹{(getProductPrice(item.product_id) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">
                      ₹{calculateOrderTotal(order.order_details).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
