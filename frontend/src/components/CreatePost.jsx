import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
};

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [mentions, setMentions] = useState('');
  const [location, setLocation] = useState(null);

  const { user } = useAuth();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    console.log(user);
    if (!user) {
      alert('User not logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    if (media) formData.append('media', media);

    if (location) {
      formData.append('location[lat]', location.lat);
      formData.append('location[lng]', location.lng);
    }

    const mentionList = mentions
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '');

    if (mentionList.length > 0) {
      mentionList.forEach(id => formData.append('mentions[]', id));
    }

    try {
      console.log('Creating post with data:', {
        description,
        media,
        mentions: mentionList,
      });
      await axios.post(`http://localhost:5001/api/users/${user.id}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDescription('');
      setMedia(null);
      setMentions('');
      alert('Post created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="bg-white shadow-md rounded-lg p-4 mb-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        required
      />
      <input
        type="file"
        onChange={(e) => setMedia(e.target.files[0])}
        className="mb-4"
        accept="image/*,video/*"
      />
      <input
        type="text"
        value={mentions}
        onChange={(e) => setMentions(e.target.value)}
        placeholder="Mention user IDs (comma-separated)"
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Location (optional)</label>
        <MapContainer center={[33.6844, 73.0479]} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector setLocation={setLocation} />
          {location && <Marker position={[location.lat, location.lng]} />}
        </MapContainer>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
