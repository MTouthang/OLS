import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  getLoggedInUserDetails,
  loginUser,
  registerUser,
  resetPassword,
  updateUserDetails,
  userLogout,
} from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/mutler.middleware.js';

const router = Router();

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);

router.get('/me', isLoggedIn, getLoggedInUserDetails);
router.post('/reset', forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.put('/change-password', isLoggedIn, changePassword);
router.put(
  '/update/:userId',
  isLoggedIn,
  upload.single('avatar'),
  updateUserDetails
);

export default router;
