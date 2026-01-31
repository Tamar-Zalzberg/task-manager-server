import { Router } from 'express';
import { register, login, searchUsers, listAllUsers } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/search-user', requireAuth, searchUsers);
router.get('/users', requireAuth, listAllUsers);

export default router;
