import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      try {
        const response = await api.get(`/users/search/query?q=${query}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />

      <div>
        {users.length === 0 && query ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer">
              <div className="flex items-center">
                <img
                  src={`http://localhost:5000/${user.profilePicture}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    <Link to={`/profile/${user._id}`} className="text-blue-500 hover:text-blue-700">{user.username}</Link>
                  </h2>
                  <p className="text-gray-700">{user.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;