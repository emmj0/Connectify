import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import Search from './pages/Search';
import EditProfile from './pages/EditProfile';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/feed',
    element: (
      <PrivateRoute>
        <Feed />
      </PrivateRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    ),
  },
  {
    path: '/search',
    element: (
      <PrivateRoute>
        <Search />
      </PrivateRoute>
    ),
  },
  {
    path: '/edit-profile',
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);