import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <FaInstagram />
        </Link>
        <nav>
          <ul className="flex space-x-4">
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;