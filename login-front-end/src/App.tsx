import React from 'react'
import ReactDOM from 'react-dom/client'
import { useAtom } from 'jotai'

import './index.css'
import {Login} from "./components/Login";
import { Register } from "./components/Register";
import { AuthInitializer } from "./components/AuthInitializer";
import { pageViewAtom } from "./atoms/auth";

const AppContent = () => {
  const [pageView] = useAtom(pageViewAtom);
  
  return (
    <div className="container">
      {pageView === 'login' ? <Login /> : <Register />}
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