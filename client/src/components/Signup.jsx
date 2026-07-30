import React, { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup attempt:', { name, email, password });
    // API call will go here
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE: dark blue background */}
      <div className="flex-1 bg-[#0b1a33] flex flex-col items-center justify-center p-6">
        {/* blue square with white text */}
        <div className="bg-blue-600 p-8 max-w-xs w-full text-center">
          <p className="text-white text-lg font-semibold leading-snug">
            Sign Up Page
            <br />
            <span className="font-light text-sm block mt-1">
              create your account with us
            </span>
          </p>
        </div>
        <div className="mt-6 text-blue-200/40 text-xs">✦</div>
      </div>

      {/* RIGHT SIDE: white background */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6">
        {/* black square perimeter (border only) */}
        <div className="w-full max-w-sm border-2 border-black bg-white p-8">
          <h2 className="text-2xl font-bold text-black text-center mb-1">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="mt-5">
            {/* Name field */}
            <div className="mt-4">
              <label htmlFor="name" className="block text-sm font-medium text-black/70 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* Email field */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* Password field */}
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
                minLength="6"
              />
            </div>

            {/* Confirm Password field */}
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black/70 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* Blue signup button */}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white font-medium py-2.5 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign Up</span>
              <span className="text-sm">→</span>
            </button>
          </form>

          {/* "Already have an account?" in black, "Login" in blue */}
          <p className="text-center text-black/80 text-sm mt-5">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;