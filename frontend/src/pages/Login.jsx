// pages/Login.jsx - Login/Signup Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser, createUser, getUser } from '../api';
import { FiUser, FiLock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    name: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login for:', formData.userId);
      const response = await loginUser(formData.userId, formData.password);
      console.log('Login response:', response);
      
      if (response.result?.error) {
        setError(response.result.error);
        setLoading(false);
        return;
      }

      // Get user info
      console.log('Fetching user info...');
      const userResponse = await getUser(formData.userId);
      console.log('User response:', userResponse.data);
      
      login({
        userId: formData.userId,
        name: userResponse.data.name,
        address: userResponse.data.address,
        phone: userResponse.data.phone
      });
      
      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUser({
        user_id: formData.userId,
        name: formData.name,
        password: formData.password,
        address: formData.address,
        phone: formData.phone
      });

      // Auto-login after signup
      login({
        userId: formData.userId,
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      });
      
      navigate('/');
    } catch (error) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to continue shopping' : 'Join us and start shopping'}</p>
        </div>

        <div className="tab-switcher">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          <div className="form-group">
            <label><FiUser /> User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Enter your user ID"
              required
            />
          </div>

          <div className="form-group">
            <label><FiLock /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label><FiMail /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label><FiMapPin /> Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="form-group">
                <label><FiPhone /> Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <code>john123 / pass123</code>
          <code>jane456 / jane@123</code>
          <code>bob789 / bob2024</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
