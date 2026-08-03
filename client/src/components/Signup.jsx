import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { signup } from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Full name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await signup({ name, email, password });
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create your account. That email may already be registered.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrap">
      <div className="glass-card auth-card">
        <div className="text-center mb-8">
          <div className="auth-brand-icon">TM</div>
          <h2 className="text-3xl font-bold mt-4" style={{ color: '#0b1a33' }}>Join TaskFlow</h2>
          <p className="text-gray-500 mt-1">Create your free account</p>
        </div>
        <div className='h-4'></div>
        {serverError && <div className="alert-banner alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-modern${errors.name ? ' error' : ''}`}
              placeholder="Muhammad Ali"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input-modern${errors.email ? ' error' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="form-label" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-modern${errors.password ? ' error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1.5">{errors.password}</p>}
          </div>
          <div className="mb-6">
            <label className="form-label" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input-modern${errors.confirmPassword ? ' error' : ''}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1.5">{errors.confirmPassword}</p>}
          </div>
          <div className='h-6'></div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-base py-3" style={{ justifyContent: 'center' }}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <FaUserPlus />
                <span>Create account</span>
              </>
            )}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#2563eb' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
