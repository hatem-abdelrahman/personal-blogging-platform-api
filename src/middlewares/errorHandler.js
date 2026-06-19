const errorHandler = (err, req, res, next) => {
  console.error("SERVER ERROR ERROR_STACK:", err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server.";

  res.status(statusCode).json({
    status: "error",
    message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
