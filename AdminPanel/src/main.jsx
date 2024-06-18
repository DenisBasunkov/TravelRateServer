import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Home } from './Pages/Home/Home'
import "./assets/_module.scss"
import 'rsuite/dist/rsuite.min.css';
import { Users } from './Pages/Users/Users';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Header } from './Components/Header';
import { Nav, Sidenav } from 'rsuite';
import { Point } from './Pages/Point';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode >
    <Home />
  </React.StrictMode >,
)
