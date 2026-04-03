// pages/Home.jsx - Products Page

import { useState, useEffect } from 'react';
import { getProducts, getCart } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { updateCartCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.products);

        // Fetch cart count if user is logged in
        if (user) {
          const cartResponse = await getCart(user.userId);
          const totalItems = cartResponse.data.cart.reduce((sum, item) => sum + item.quantity, 0);
          updateCartCount(totalItems);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, updateCartCount]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ShopMCP</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="products-section">
        <h2>Our Products</h2>
        <div className="products-grid">
          {Object.entries(products).map(([id, product]) => (
            <ProductCard 
              key={id} 
              product={product} 
              productId={parseInt(id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
