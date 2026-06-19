const { z } = require("zod");

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Post title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  content: z.string().min(1, "Post content is required").trim(),
});

const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Post title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .trim()
    .optional(),
  content: z.string().min(1, "Post content cannot be empty").trim().optional(),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
};
