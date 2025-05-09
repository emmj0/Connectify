import React, { useState } from 'react';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/users/search/query?q=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
        >
          Search
        </button>
      </form>
      <div>
        {users.map((user) => (
          <div key={user._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-700">{user.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;