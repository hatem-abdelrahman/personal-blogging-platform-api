const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Route imports
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies in requests

//Routes setup
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

//Simple testing route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy!" });
});

// Centralized Error Handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
