import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const app = document.getElementById('app')
if (!app) throw new Error('missing app element')

const root = ReactDOM.createRoot(app)
root.render(React.createElement(App))
