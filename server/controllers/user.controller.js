import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
  httpOnly: true,
};

/**
 * @REGISTRATION
 * @ROUTE @POST {{URL}}/api/v1/register
 * @return created user data with user registered massage
 * @ACCESS public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  // extract data
  const { name, email, password } = req.body;

  // check if the data is there or not, if not throw error message
  if (!name || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  // check if the user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError('Email already exist', 409));
  }

  // create new user data object
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 135,
      secure_url: 'random_url',
    },
  });
  // If user not created send message response
  if (!user) {
    return next(
      new AppError('User registration failed, please try again later', 400)
    );
  }

  // Generating a JWT token
  const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie('token', token, cookieOptions);

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
});

/**
 * @userLogin
 * @ROUTE @POST {{URL}}/api/v1/login
 * @return access token and user logged in successfully message
 * @ACCESS public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  // destructuring the necessary data from from req object
  const { email, password } = req.body;

  // check if the user data is available
  if (!email || !password) {
    return next(new AppError('Email and Password are required', 404));
  }

  // Finding the user data with the sent email
  const user = await User.findOne({ email }).select('+password');
  // if no user or sent password do not match then send generic response
  if (!(user && (await user.comparePassword(password)))) {
    return next(
      new AppError('Email or Password do not match or user does not exist', 401)
    );
  }
  // generate JWT token
  const token = await user.generateJWTToken();

  // setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // setting the token in the cookie with the name token along with the cookie option
  res.cookie('token', token, cookieOptions);

  // if all good send the response to the frontend
  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    user,
  });
});

/**
 * @userLogout
 * @ROUTE @POST {{URL}}/api/v1/logout
 * @return message with user logout successfully
 * @ACCESS private
 */

export const userLogout = asyncHandler(async (req, res, next) => {
  // logout by clearing cookies

  res.cookie('token', null, {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User Logout successfully',
  });
});
