const prisma = require('../config/db');

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
      status: 'success',
      message: 'Post created successfully!',
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
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
        createdAt: 'desc', // Show newest posts first
      },
    });

    return res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    console.error('Get All Posts Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};
