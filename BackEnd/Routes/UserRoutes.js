const express = require('express');
const userController = require('../Controllers/userController');
const router = express.Router();
const upload = require('../MiddleWare/upload');

// User routes
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Post routes
router.post('/:id/posts', upload.single('media'), userController.createPost);
router.get('/:id/posts/:postId', userController.getPost);
router.put('/:id/posts/:postId/update',upload.none(), userController.updatePost);
router.delete('/:id/posts/:postId/delete', userController.deletePost);
router.post('/:id/posts/:postId/like', userController.likePost);
router.post('/:id/posts/:postId/comment', userController.commentOnPost);
router.put('/:id/follow', userController.followUser);
router.put('/:id/unfollow', userController.unfollowUser);
router.get('/search/query', userController.searchUsers);

module.exports = router;