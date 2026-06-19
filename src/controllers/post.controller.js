const prisma = require("../config/db");

// POST /api/posts (Protected)
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id; // Retreived from protect middleware

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Post created successfully!",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error occurred.",
    });
  }
};

// GET /api/posts (Public)
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Show newest posts first
      },
    });

    return res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    console.error("Get All Posts Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error occurred.",
    });
  }
};

// PUT /api/posts/:id (Protected - Owner only)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    // 1. Find the post
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found.",
      });
    }
    // 2. Ownership check: Only the author can update the post
    if (post.authorId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this post.",
      });
    }
    // 3. Update the post
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined,
        content: content || undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json({
      status: "success",
      message: "Post updated successfully!",
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    next(error);
  }
};
// DELETE /api/posts/:id (Protected - Owner only)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    // 1. Find the post
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found.",
      });
    }
    // 2. Ownership check: Only the author can delete the post
    if (post.authorId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this post.",
      });
    }
    // 3. Delete the post
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({
      status: "success",
      message: "Post deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
};
