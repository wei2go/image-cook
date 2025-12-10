import { compressImageToJpeg } from './image-processing';
import sharp from 'sharp';

describe('Image Processing', () => {
  describe('compressImageToJpeg', () => {
    it('should compress PNG to 396x396 JPEG at 90% quality', async () => {
      // Create test 1024x1024 PNG
      const testImage = await sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 }
        }
      }).png().toBuffer();

      // Compress
      const compressed = await compressImageToJpeg(testImage);

      // Verify format, dimensions, compression
      const metadata = await sharp(compressed).metadata();
      expect(metadata.format).toBe('jpeg');
      expect(metadata.width).toBe(396);
      expect(metadata.height).toBe(396);
      expect(compressed.length).toBeLessThan(testImage.length);
    });
  });
});
