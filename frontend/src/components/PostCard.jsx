import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const PostCard = ({ post, key, onPostUpdated }) => {
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState(post.description);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    const viewerId = user ? user.id : null;

    let isOwner = false;
    if (post.user?._id === undefined) {
        if (post.user === userId) {
            isOwner = true;
        }
    }
    console.log("post", post);
    console.log("post media", post.media);

    useEffect(() => {
        if (Array.isArray(post.likes) && userId) {
            const hasLiked = post.likes.some((likerId) => likerId?.toString() === userId);
            setIsLiked(hasLiked);
        }
    }, [post.likes, userId]);

    const handleLike = async () => {
        try {
            const endpoint = isLiked
                ? `/users/${userId}/posts/${post._id}/unlike`
                : `/users/${userId}/posts/${post._id}/like`;

            await api.post(endpoint);
            setIsLiked(!isLiked);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to like/unlike post:', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await api.post(`/users/${userId}/posts/${post._id}/comment`, {
                text: commentText,
                username: user.username,
            });
            setCommentText('');
            onPostUpdated();
        } catch (err) {
            console.error('Failed to comment:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await api.delete(`users/${userId}/posts/${post._id}/delete`);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/users/${userId}/posts/${post._id}/update`, {
                description: updatedDescription,
            });
            setIsEditing(false);
            onPostUpdated();
        } catch (err) {
            console.error('Failed to update post:', err);
        }
    };

    return (

        <div className="bg-white shadow rounded-xl p-6 border border-gray-200 mb-4">
            <div className="flex items-center mb-4">
                <img
                    src={
                        post.user?.profilePicture
                            ? `http://localhost:5000/${post.user.profilePicture}`
                            : '/default-avatar.png'
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover mr-3 border"
                />
                <div>
                    <p className="font-semibold text-gray-800">{post.user?.username || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>
            {post.media && (
                <img
                    src={`http://localhost:5000/${post.media}`}
                    alt={post.title || 'Post Image'}
                    className="w-full h-64 object-cover rounded mb-4"
                />
            )}


            <div className="mb-4">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>

            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                    <button
                        onClick={handleUpdate}
                        className="mt-2 text-green-600 hover:text-green-800 font-semibold"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <p className="text-gray-700 mb-4">{post.description}</p>
            )}

            {isOwner && (
                <div className="flex gap-4 mb-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-yellow-600 hover:text-yellow-800 font-semibold"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 font-semibold"
                    >
                        Delete
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={handleLike}
                    className={`font-semibold ${isLiked ? 'text-red-600 hover:text-red-800' : 'text-blue-600 hover:text-blue-800'}`}
                >
                    {isLiked ? 'Unlike' : 'Like'} ({post.likes.length})
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
                <button type="submit" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Comment
                </button>
            </form>

            <div className="space-y-2">
                {Array.isArray(post.comments) && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                        <div key={comment._id} className="text-sm text-gray-600">
                            <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text}
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
