import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../Context/AuthContext'; // Assuming you're using useAuth to get user info

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [mentions, setMentions] = useState('');
  const { user } = useAuth(); // Get the logged-in user

  const handleCreatePost = async (e) => {
    e.preventDefault();

    console.log(user); // Debugging line to check user info
    if (!user) {
      alert('User not logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    if (media) formData.append('media', media);

    // Convert comma-separated mentions to an array of user IDs
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
      await api.post(`/users/${user.id}/posts`, formData, {
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
