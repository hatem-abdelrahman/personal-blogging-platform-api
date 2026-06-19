const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createPostSchema } = require('../validators/post.validator');

// GET /api/posts (Public - view all posts)
router.get('/', postController.getAllPosts);

// POST /api/posts (Protected - create a post)
router.post('/', protect, validate(createPostSchema), postController.createPost);

module.exports = router;
