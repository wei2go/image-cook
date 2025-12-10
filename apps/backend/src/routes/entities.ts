import { Router } from 'express';
import { firestoreService } from '../services/firestore-service';
import { initEntitiesFromStorage } from '../services/init-service';

export const entitiesRouter = Router();

entitiesRouter.get('/', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const entities = await firestoreService.getAllEntities(category);
    res.json({ entities, count: entities.length });
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities', details: (error as Error).message });
  }
});

entitiesRouter.post('/init', async (req, res) => {
  try {
    const { entities: entityData, category } = req.body;

    if (!Array.isArray(entityData) || !category) {
      return res.status(400).json({ error: 'entities and category required' });
    }

    const entities = await initEntitiesFromStorage(entityData, category);
    res.json({ success: true, count: entities.length, entities });
  } catch (error) {
    console.error('Error initializing entities:', error);
    res.status(500).json({ error: 'Failed to initialise entities', details: (error as Error).message });
  }
});
