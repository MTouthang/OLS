import { Router } from 'express';
import {
  loginUser,
  registerUser,
  userLogout,
} from '../controllers/user.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);

export default router;
