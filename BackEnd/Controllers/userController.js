const User = require('../Models/userModel');
const Post = require('../Models/postModel');

const mongoose = require('mongoose');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts').populate('followers').populate('following');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.updateUser = async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Controllers/userController.js
// const User = require('../Models/userModel');
// const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.updateUser = async (req, res) => {
    try {
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        const userId = req.params.id;

        // Check if a profile picture is uploaded
        let profilePicturePath = null;
        if (req.file) {
            profilePicturePath = req.file.path;
        }

        // Prepare the update object
        const updateData = {};
        if (req.body.username) updateData.username = req.body.username;
        if (req.body.email) updateData.email = req.body.email;
        if (profilePicturePath) updateData.profilePicture = profilePicturePath;

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send a success response with the updated user data
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { description, mentions } = req.body;
        const mediaPath = req.file ? req.file.path : null;

        const newPost = new Post({
            user: req.params.id,
            description,
            media: mediaPath,
            mentions: mentions ? mentions.map(userId => mongoose.Types.ObjectId(userId)) : [],
        });

        await newPost.save();
        await User.findByIdAndUpdate(req.params.id, { $push: { posts: newPost._id } });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller
exports.getFeedPosts = async (req, res) => {
    try {
    console.log("User ID:", req.params.id);
    console.log("Request Body:", req.body);
      const user = await User.findById(req.params.id).populate('following');
      console.log("User:", user);
      const followingIds = user.following.map(f => f._id);
      console.log("Following IDs:", followingIds);
  
      const posts = await Post.find({ user: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('comments.user')
        .populate('likes');
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate('user')
            .populate('comments.user')
            .populate('likes')
            .populate('mentions');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.params.postId;
        console.log("req.body:", req.body);

        // Confirm ownership
        const user = await User.findOne({ _id: userId, posts: postId });
        if (!user) {
            return res.status(403).json({ error: 'Unauthorized: You can only update your own posts' });
        }

        // Extract and sanitize input
        const { description } = req.body;
        let { mentions } = req.body;

        console.log('Mentions:', mentions); // Debugging line
        console.log('Description:', description); // Debugging line

        // Parse mentions if provided as JSON string
        if (mentions !== undefined) {
            if (typeof mentions === 'string') {
                try {
                    const parsed = JSON.parse(mentions);
                    mentions = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    mentions = [mentions];
                }
            } else if (!Array.isArray(mentions)) {
                mentions = [mentions];
            }
        }

        // Build update object
        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (mentions !== undefined && mentions.length > 0) {
            updateData.mentions = mentions.map(id => {
                if (typeof id === 'string' && id.length === 24) {
                    return mongoose.Types.ObjectId(id);
                } else if (typeof id === 'number') {
                    return mongoose.Types.ObjectId(String(id));
                } else {
                    return mongoose.Types.ObjectId();
                }
            });
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




exports.deletePost = async (req, res) => {
    const userId = req.params.id;
    const postId = req.params.postId;
    try {
        const user = await User.findOne({ _id: userId, posts: postId });
        if (!user) {
            return res.status(403).json({ error: 'Unauthorized: You can only update your own posts' });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); 
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userId = req.params.userId; 
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        res.status(200).json({ message: "Post liked", post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// In userController.js

exports.followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (!user || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.followers.includes(req.body.userId)) {
            user.followers.push(req.body.userId);
            currentUser.following.push(req.params.id);
            await user.save();
            await currentUser.save();
            res.status(200).json({ message: "User followed" });
        } else {
            res.status(400).json({ error: "Already following" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('username email profilePicture');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.unfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (!user || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.followers.includes(req.body.userId)) {
            user.followers.pull(req.body.userId);
            currentUser.following.pull(req.params.id);
            await user.save();
            await currentUser.save();
            res.status(200).json({ message: "User unfollowed" });
        } else {
            res.status(400).json({ error: "Not following" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.commentOnPost = async (req, res) => {
    try {
        const { text, userId } = req.body; 
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = {
            user: userId,
            text,
            createdAt: Date.now(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ message: "Comment added", post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
