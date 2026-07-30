import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle signup logic here
    console.log("Signup attempted with:", { name, email, password });
    // After successful signup, navigate to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
         style={{ backgroundColor: "var(--primary-color)" }}>
      
      {/* Back to Home Button - Top Left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <FaArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="max-w-lg w-full space-y-8 p-8 sm:p-10 rounded-2xl"
           style={{
             backgroundColor: "var(--card-bg)",
             border: "1px solid var(--border-color)",
           }}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-color)" }}>
            Create Account
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Join us and start your journey
          </p>
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm sm:text-base font-medium mb-2"
                   style={{ color: "var(--text-color)" }}>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FaUser size={18} className="sm:w-5 sm:h-5" style={{ color: "var(--text-secondary)" }} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-2"
                   style={{ color: "var(--text-color)" }}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FaEnvelope size={18} className="sm:w-5 sm:h-5" style={{ color: "var(--text-secondary)" }} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm sm:text-base font-medium mb-2"
                   style={{ color: "var(--text-color)" }}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FaLock size={18} className="sm:w-5 sm:h-5" style={{ color: "var(--text-secondary)" }} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                style={{ color: "var(--text-secondary)" }}
              >
                {showPassword ? <FaEyeSlash size={18} className="sm:w-5 sm:h-5" /> : <FaEye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm sm:text-base font-medium mb-2"
                   style={{ color: "var(--text-color)" }}>
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FaLock size={18} className="sm:w-5 sm:h-5" style={{ color: "var(--text-secondary)" }} />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                style={{ color: "var(--text-secondary)" }}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} className="sm:w-5 sm:h-5" /> : <FaEye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:opacity-80 hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "var(--primary-color)",
            }}
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-medium hover:underline"
                 style={{ color: "#2563eb" }}>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;