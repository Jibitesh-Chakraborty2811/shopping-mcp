// api.js - API client for MCP Server

import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// PRODUCTS API
// ========================================

export const getProducts = () => api.get('/products');
export const getProduct = (productId) => api.get(`/products/${productId}`);

// ========================================
// USERS API
// ========================================

export const createUser = (userData) => api.post('/users', userData);
export const getUser = (userId) => api.get(`/users/${userId}`);
export const loginUser = async (userId, password) => {
  // We'll verify login by calling the MCP endpoint
  try {
    const response = await axios.post('http://localhost:8000/mcp', {
      tool: 'login',
      args: { user_id: userId, password }
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

// ========================================
// CART API
// ========================================

export const getCart = (userId) => api.get(`/carts/${userId}`);
export const addToCart = (userId, productId, quantity) => 
  api.post(`/carts/${userId}`, { product_id: productId, quantity });
export const removeFromCart = (userId, productId) => 
  api.delete(`/carts/${userId}/${productId}`);
export const clearCart = (userId) => api.delete(`/carts/${userId}`);
export const updateCart = (userId, cart) => api.put(`/carts/${userId}`, cart);

// ========================================
// ORDERS API
// ========================================

export const getOrders = (userId) => api.get(`/orders/${userId}`);
export const createOrder = (userId) => api.post(`/orders/${userId}`);

export default api;
