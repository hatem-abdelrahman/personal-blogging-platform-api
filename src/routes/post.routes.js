const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validators/post.validator");

// GET /api/posts (Public - view all posts)
router.get("/", postController.getAllPosts);

// POST /api/posts (Protected - create a post)
router.post(
  "/",
  protect,
  validate(createPostSchema),
  postController.createPost,
);

// PUT /api/posts/:id (Protected - update a post)
router.put(
  "/:id",
  protect,
  validate(updatePostSchema),
  postController.updatePost,
);

// DELETE /api/posts/:id (Protected - delete a post)
router.delete("/:id", protect, postController.deletePost);

module.exports = router;
