const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

export default asyncHandler;

// Function Declaration:
// const asyncHandler = (fn) => ... defines a higher-order function named asyncHandler that takes another function fn as an argument.

// Returned Middleware Function:
// (req, res, next) => ... returns a new middleware function that accepts the standard Express request (req), response (res), and next middleware function (next) arguments.

// Executing the Wrapped Middleware:
// fn(req, res, next) calls the original middleware function fn, passing along the request, response, and next function.
// The .catch((err) => next(err)); part handles potential errors:
// If fn returns a promise that rejects, the .catch block captures the error.
// It calls next(err) to pass the error to the next middleware in the chain, ensuring appropriate error handling.
