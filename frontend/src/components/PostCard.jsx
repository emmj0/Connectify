import React, { useState } from 'react';
import axios from 'axios';

const PostCard = ({ post, onPostUpdated }) => {
  const [commentText, setCommentText] = useState('');
  const user = JSON.parse(localStorage.getItem('user')); // Assuming the user object is stored in localStorage
  const userId = user ? user.id : null; // Get the user ID from the user object
  console.log('User ID:', userId);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${userId}/posts/${post._id}/like`);
      console.log('Liked post response:', response.data);
      console.log('Post liked successfully');
      onPostUpdated();
    } catch (err) {
      console.error('Failed to like post:', err);
      if (err.response) {
        console.error('Server responded with:', err.response.data);
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/users/${userId}/posts/${post._id}/comment`, { text: commentText });
      console.log('Commented post response:', response.data);
      setCommentText('');
      onPostUpdated();
    } catch (err) {
      console.error('Failed to comment:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={`http://localhost:5000/${post.user.profilePicture}`}
          alt={post.user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-bold text-gray-800">{post.user.username}</h4>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{post.description}</p>

      {post.media && (
        <div className="mb-4">
          <img
            src={`http://localhost:5000/${post.media.replace(/\\/g, '/')}`}
            alt="Post media"
            className="w-full rounded"
          />
        </div>
      )}

      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          ❤️ Like ({post.likes.length})
        </button>
      </div>

      <form onSubmit={handleComment} className="mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </form>

      <div className="space-y-2">
        {Array.isArray(post.comments) && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment._id} className="text-sm text-gray-600">
              <strong>{comment.user.username}:</strong> {comment.text}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default PostCard;