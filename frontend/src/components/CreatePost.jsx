import React, { useState } from 'react';
import api from '../services/api';

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('media', media);

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDescription('');
      setMedia(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="bg-white shadow-md rounded-lg p-4 mb-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />
      <input
        type="file"
        onChange={(e) => setMedia(e.target.files[0])}
        className="mb-4"
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