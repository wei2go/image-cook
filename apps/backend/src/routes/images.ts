import { Router } from "express";
import { body, validationResult } from "express-validator";
import { approveImage, deselectImage } from "../services/selection-service";

export const imagesRouter = Router();

imagesRouter.post(
  "/approve",
  body("entityId").isString().trim().isLength({ min: 1, max: 100 }),
  body("model").isString().trim().isLength({ min: 1, max: 50 }),
  body("version").isInt({ min: 1, max: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: errors.array() });
    }

    try {
      const { entityId, model, version } = req.body;
      const selectedImage = await approveImage(
        entityId,
        model,
        parseInt(version),
      );
      res.json({ success: true, selectedImage });
    } catch (error) {
      console.error("Error approving image:", error);
      res.status(500).json({ error: "Failed to approve image" });
    }
  },
);

imagesRouter.post(
  "/deselect",
  body("entityId").isString().trim().isLength({ min: 1, max: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: errors.array() });
    }

    try {
      const { entityId } = req.body;
      await deselectImage(entityId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deselecting image:", error);
      res.status(500).json({ error: "Failed to deselect image" });
    }
  },
);
