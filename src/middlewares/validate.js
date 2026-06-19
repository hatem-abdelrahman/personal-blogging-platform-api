const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    // Parse the request body using the zod schema
    schema.parse(req.body);
    next(); // Valid! Go to the next middleware or controller
  } catch (error) {
    // Only handle Zod validation errors here
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // If it's a different error, pass it to Express's global error handler
    next(error);
  }
};

module.exports = validate;
