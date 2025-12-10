import { Router } from 'express';
import { approveImage, deselectImage } from '../services/selection-service';

export const imagesRouter = Router();

imagesRouter.post('/approve', async (req, res) => {
  try {
    const { entityId, model, version } = req.body;

    if (!entityId || !model || version === undefined) {
      return res.status(400).json({ error: 'entityId, model, version required' });
    }

    const selectedImage = await approveImage(entityId, model, parseInt(version));
    res.json({ success: true, selectedImage });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

imagesRouter.post('/deselect', async (req, res) => {
  try {
    const { entityId } = req.body;

    if (!entityId) {
      return res.status(400).json({ error: 'entityId required' });
    }

    await deselectImage(entityId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
