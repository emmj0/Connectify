import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);

        const userId = decoded.id;

        // Fetch user data using the user ID
        fetch(`http://localhost:5000/api/users/${userId}`)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch user data');
            return res.json();
          })
          .then((data) => {
            console.log('User data:', data);
            if (data.profilePicture) {
              setProfilePic(data.profilePicture);
            }
          })
          .catch((err) => {
            console.error('Error fetching user data:', err);
          });
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
          <ul className="flex space-x-4 items-center">
            {isLoggedIn ? (
              <>
                <li>
                  <img
                    src={profilePic ? `http://localhost:5000/${profilePic}` : '/default-profile.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-500"
                  >
                    Logout
                  </button>
                </li>
              </>
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
