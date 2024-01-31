import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { createCourse } from '../controllers/course.controller.js';
const router = express.Router();

router.post('/', isLoggedIn, authorizeRoles('ADMIN'), createCourse);

export default router;
