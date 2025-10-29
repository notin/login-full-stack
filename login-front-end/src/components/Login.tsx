import React, {useEffect, useState} from "react";
import { useAtom, useSetAtom } from "jotai";
import { loginAtom } from "../atoms/authActions";
import { pageViewAtom, isAuthenticatedAtom } from "../atoms/auth";
import "./Login.css";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useSetAtom(loginAtom);
  const setPageView = useSetAtom(pageViewAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  useEffect(() => {
    if (isAuthenticated) {
      setPageView("dashboard");
    }
  }, [isAuthenticated, setPageView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      setPageView("dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  console.log('Login component rendering');
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/*<label htmlFor="email">Email</label>*/}
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
            {/*<label htmlFor="password">Password</label>*/}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Enter"}
          </button>
          <p className="auth-switch">
            Don't have an account?{" "}
            <span 
              className="auth-link"
              onClick={() => setPageView("register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

