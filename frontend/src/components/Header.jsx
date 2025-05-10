import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (you can customize this check)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // or any user-related data
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <FaInstagram />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-gray-700 hover:text-blue-500">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-700 hover:text-blue-500">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
