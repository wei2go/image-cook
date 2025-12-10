import { describe, it } from '@jest/globals';

describe('Images Routes', () => {
  describe('POST /images/approve', () => {
    it.todo('should approve image and return selectedImage');
    it.todo('should return 400 if entityId missing');
    it.todo('should return 400 if model missing');
    it.todo('should return 400 if version missing');
    it.todo('should return 500 if entity not found');
  });

  describe('POST /images/deselect', () => {
    it.todo('should deselect image');
    it.todo('should return 400 if entityId missing');
  });
});
