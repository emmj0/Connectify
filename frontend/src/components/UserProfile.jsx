import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewerId, setViewerId] = useState(null);
  const { id: profileId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setViewerId(decoded.id);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${profileId}`);
      setUserData(response.data);
      setIsFollowing(response.data.followers.some(f => f._id === viewerId));
    } catch (error) {
      console.error(error);
      alert(error.response?.status === 404 ? 'User not found' : 'An error occurred.');
    }
  };

  useEffect(() => {
    if (profileId && viewerId) {
      fetchUser();
    }
  }, [profileId, viewerId]);

  const handleFollow = async () => {
    try {
      await api.put(`/users/${userData._id}/follow`, { userId: viewerId });
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.put(`/users/${userData._id}/unfollow`, { userId: viewerId });
      fetchUser();
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
              className={`bg-${isFollowing ? 'red' : 'blue'}-500 hover:bg-${isFollowing ? 'red' : 'blue'}-700 text-white font-bold py-2 px-4 rounded`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Posts</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {userData.posts.length > 0 ? (
              userData.posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  viewerId={viewerId}
                  onPostUpdated={fetchUser}
                />
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
