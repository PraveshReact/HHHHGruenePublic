import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomeComponent from './HomeComponent';
import SmartpageComponent from './SmartpageComponent';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import './CSS/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import NewsHomemainPage from './NewsHome';
import EventHomemainPage from './EventHome';
import Layout from './Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><Layout /></>}>
      <Route path='' element={<HomeComponent />} />
      <Route path=':SmartPage' element={<SmartpageComponent />}>
        <Route path=':SmartPage' element={<SmartpageComponent />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


