import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../services/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${user._id}`);
        setUserData(response.data);
        setIsFollowing(response.data.followers.includes(user._id));
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [user]);

  const handleFollow = async () => {
    try {
      await api.put(`/users/${userData._id}/follow`, { userId: user._id });
      setIsFollowing(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.put(`/users/${userData._id}/unfollow`, { userId: user._id });
      setIsFollowing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <img
            src={userData.profilePicture}
            alt={userData.username}
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-gray-700">{userData.name}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold">Posts</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {userData.posts.map((post) => (
              <div key={post._id} className="bg-gray-100 rounded-lg p-2">
                <img src={post.media} alt={post.description} className="w-full h-40 object-cover rounded-lg" />
                <p className="text-gray-700 mt-2">{post.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;