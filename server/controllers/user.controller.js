import asyncHandler from '../middlewares/asyncHandler.middleware';
import AppError from '../utils/appError';
import User from '../models/user.model';

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
  httpOnly: true,
};

export const registerUser = asyncHandler(async (req, res, next) => {
  // extract data
  const { fullName, email, password } = req.body;

  // check if the data is there or not, if not throw error message
  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  // check if the user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError('Email already exist', 409));
  }

  // create new user data object
  const user = await User.create({
    fullName,
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
