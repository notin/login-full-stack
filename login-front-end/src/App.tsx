import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import {Login} from "./components/Login";
import { AuthInitializer } from "./components/AuthInitializer";

const App = () => (
  <AuthInitializer>
    <div className="container">
      <Login />
    </div>
  </AuthInitializer>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)