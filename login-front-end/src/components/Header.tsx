import React from "react";
import { useSetAtom, useAtom } from "jotai";
import { logoutAtom } from "../atoms/authActions";
import { pageViewAtom, userAtom } from "../atoms/auth";
import "./Header.css";

export const Header: React.FC = () => {
  const [pageView, setPageView] = useAtom(pageViewAtom);
  const [user] = useAtom(userAtom);
  const [, logout] = useAtom(logoutAtom);

  const handleLogout = () => {
    logout();
    setPageView("login");
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <h2>User Portal</h2>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-btn ${pageView === "dashboard" ? "active" : ""}`}
            onClick={() => setPageView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${pageView === "browse" ? "active" : ""}`}
            onClick={() => setPageView("browse")}
          >
            Browse
          </button>
        </nav>
        <div className="header-user">
          <span className="user-email">{user?.email || "User"}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

