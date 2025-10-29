import React, { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { registerAtom } from "../atoms/authActions";
import { isAuthenticatedAtom, pageViewAtom } from "../atoms/auth";
import "./Login.css";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, register] = useAtom(registerAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setPageView = useSetAtom(pageViewAtom);

  useEffect(() => {
    if (isAuthenticated) {
      setPageView("dashboard");
    }
  }, [isAuthenticated, setPageView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password });
      setPageView("dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className="auth-switch">
            Already have an account?{" "}
            <span 
              className="auth-link"
              onClick={() => setPageView("login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

