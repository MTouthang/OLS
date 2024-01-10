import jwt, { decode } from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import asyncHandler from './asyncHandler.middleware.js';

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError('Unauthorized, Please Login to continue', 401));
  }
  // decoding the token using jwt package verify method
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // if no decode sent the message unauthorized
  if (!decoded) {
    return next(new AppError('Unauthorized, please login to continue', 401));
  }

  // if all good store the id in req object, modifying the request object adding a custom field user in it
  req.user = decoded;

  // Do not forget to call the next otherwise the flow of execution will not be passed further.
  next();
});
