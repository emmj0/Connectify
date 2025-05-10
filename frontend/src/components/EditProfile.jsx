import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';  // Assuming you are using this hook to access the logged-in user data.
import api from '../services/api';  // API utility to handle requests.

const EditProfile = () => {
  const { user } = useAuth();  // Access logged-in user from context.
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile data when the component is mounted
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/users/${user.id}`);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle form submission to update the user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    // Prepare the form data to be sent to the API
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
  
    // Only append profile picture if it's changed
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
  
    try {
      console.log('Updating profile with data:', formData);
      const response = await api.put(`/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
};

  // If the profile is still loading, display a loading message.
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleUpdateProfile} className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-gray-700 font-bold mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
