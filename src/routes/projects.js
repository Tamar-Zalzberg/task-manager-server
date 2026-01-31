import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/projects.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
