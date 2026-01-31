import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listTeams, createTeam, addMember, getTeam, removeMember, deleteTeam } from '../controllers/teams.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listTeams);
router.post('/', createTeam);
router.get('/:teamId', getTeam);
router.post('/:teamId/members', addMember);
router.delete('/:teamId/members/:userId', removeMember);
router.delete('/:teamId', deleteTeam);

export default router;
