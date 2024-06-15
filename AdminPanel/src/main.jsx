import React from 'react'
import ReactDOM from 'react-dom/client'
import { Home } from './Pages/Home/Home'
import "./assets/_module.scss"
import 'rsuite/dist/rsuite.min.css';
import { Tables } from './Pages/Table/Tables';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/Tables",
    element: <Tables />
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
