import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { firestoreService } from '../services/firestore-service';
import { initEntitiesFromStorage } from '../services/init-service';

export const entitiesRouter = Router();

entitiesRouter.get(
  '/',
  query('category').optional().isString().trim().isLength({ min: 1, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    try {
      const category = req.query?.category as string | undefined;
      const entities = await firestoreService.getAllEntities(category);
      res.json({ entities, count: entities.length });
    } catch (error) {
      console.error('Error fetching entities:', error);
      res.status(500).json({ error: 'Failed to fetch entities' });
    }
  }
);

entitiesRouter.post(
  '/init',
  body('entities').isArray({ min: 1, max: 1000 }),
  body('entities.*.id').isInt({ min: 1 }),
  body('entities.*.name').isString().trim().isLength({ min: 1, max: 100 }),
  body('entities.*.description').isString().trim().isLength({ min: 1, max: 500 }),
  body('category').isString().trim().isLength({ min: 1, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    try {
      const { entities: entityData, category } = req.body;
      const entities = await initEntitiesFromStorage(entityData, category);
      res.json({ success: true, count: entities.length, entities });
    } catch (error) {
      console.error('Error initializing entities:', error);
      res.status(500).json({ error: 'Failed to initialise entities' });
    }
  }
);
