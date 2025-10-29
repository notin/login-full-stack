import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useAtom } from 'jotai'

import './index.css'
import {Login} from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Browse } from "./components/Browse";
import { Header } from "./components/Header";
import { AuthInitializer } from "./components/AuthInitializer";
import { pageViewAtom, isAuthenticatedAtom } from "./atoms/auth";

const AppContent = () => {
  const [pageView, setPageView] = useAtom(pageViewAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  // Check authentication on mount and redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && (pageView === 'login' || pageView === 'register')) {
      setPageView('dashboard');
    } else if (!isAuthenticated && (pageView === 'dashboard' || pageView === 'browse')) {
      setPageView('login');
    }
  }, [isAuthenticated, pageView, setPageView]);
  
  return (
    <div className="container">
      {isAuthenticated && <Header />}
      {pageView === 'dashboard' ? (
        <Dashboard />
      ) : pageView === 'browse' ? (
        <Browse />
      ) : pageView === 'login' ? (
        <Login />
      ) : (
        <Register />
      )}
    </div>
  );
};

const App = () => (
  <AuthInitializer>
    <AppContent />
  </AuthInitializer>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)