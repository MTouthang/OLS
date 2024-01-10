import { Router } from 'express';
import {
  getLoggedInUserDetails,
  loginUser,
  registerUser,
  userLogout,
} from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);

router.get('/me', isLoggedIn, getLoggedInUserDetails);

export default router;
