import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Course from '../models/course.model.js';
import AppError from '../utils/appError.js';

/**
 *
 * @createCourse
 * @ROUTE @POST {{URL}}/api/v1/course
 * @return course object-
 * @ACCESS private
 *
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  // extract fields form req.body and make sure they are available
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError('All fields are required', 400));
  }

  // create mongoose object of course
  const course = await Course.create({
    title,
    description,
    createdBy,
    thumbnail: {
      public_id: 'public_id',
      secure_url: 'secure_url',
    },
  });

  if (!course) {
    return next(
      new AppError('Course could not be created, please try again', 400)
    );
  }

  res.status(201).json({
    success: true,
    message: 'Course Created Successfully',
    course,
  });
});
