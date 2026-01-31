import db from '../db.js';

export function listProjects(req, res) {
  const rows = db
    .prepare(
      `SELECT p.* FROM projects p
       JOIN team_members tm ON tm.team_id = p.team_id
       WHERE tm.user_id = ?
       ORDER BY p.created_at DESC`
    )
    .all(req.user.id);
  res.json(rows);
}

export function createProject(req, res) {
  const { teamId, name, description } = req.body || {};
  if (!teamId || !name) return res.status(400).json({ error: 'teamId and name required' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  const info = db.prepare('INSERT INTO projects (team_id, name, description) VALUES (?,?,?)').run(teamId, name, description || null);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(project);
}

export function getProject(req, res) {
  const { id } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(project.team_id, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  res.json(project);
}

export function updateProject(req, res) {
  const { id } = req.params;
  const { name, description, status } = req.body || {};
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(project.team_id, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  db.prepare('UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?').run(
    name || project.name,
    description !== undefined ? description : project.description,
    status || project.status,
    id
  );
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  res.json(updated);
}

export function deleteProject(req, res) {
  const { id } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(project.team_id, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  res.status(204).send();
}
