import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewerId, setViewerId] = useState(null);
  const { id: profileId } = useParams(); // ID of profile being viewed

  // Decode the token to get viewer ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Assuming JWT token
      setViewerId(decoded.id);
    }
  }, []);

  // Fetch the profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1])); // Assuming JWT token
    const viewer = decoded.id;
    setViewerId(viewer);
  
    const fetchUser = async () => {
      try {
        console.log('Fetching user data for profile ID:', profileId);
        const response = await api.get(`/users/${profileId}`);
        console.log('User data fetched:', response.data);
        console.log('Viewer ID:', viewer);
        console.log('User followers:', response.data.followers);
  
        setUserData(response.data);
        setIsFollowing(response.data.followers.some(f => f._id === viewer));
        console.log('Is viewer following:', response.data.followers.some(f => f._id === viewer));
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          alert('User not found');
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    };
  
    if (profileId) {
      fetchUser();
    }
  }, [profileId]);
  
  const handleFollow = async () => {
    try {
      await api.put(`/users/${userData._id}/follow`, { userId: viewerId });
      setIsFollowing(true);
      alert('Followed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.put(`/users/${userData._id}/unfollow`, { userId: viewerId });
      setIsFollowing(false);
      alert('Unfollowed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userData.profilePicture ? `http://localhost:5000/${userData.profilePicture}` : 'https://via.placeholder.com/100'}
              alt={userData.username}
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-gray-700">{userData.email}</p>
              <p className="text-gray-700">{userData.bio || "No bio provided."}</p>
            </div>
          </div>

          {viewerId && viewerId !== userData._id && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`bg-${isFollowing ? 'red' : 'blue'}-500 hover:bg-${isFollowing ? 'red' : 'blue'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Posts</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {userData.posts.length ? (
              userData.posts.map((post) => (
                <div key={post._id} className="bg-gray-100 rounded-lg p-2">
                  <img src={post.media ? `http://localhost:5000/${post.media}` : 'https://via.placeholder.com/100'} alt={post.description} className="w-full h-40 object-cover rounded-lg" />
                  <p className="text-gray-700 mt-2">{post.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
