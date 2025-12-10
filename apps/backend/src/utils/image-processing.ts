import sharp from "sharp";

export interface CompressImageOptions {
  width: number;
  height: number;
  quality: number;
}

const DEFAULT_OPTIONS: CompressImageOptions = {
  width: 396,
  height: 396,
  quality: 90,
};

/**
 * Compress and resize image buffer to JPEG
 */
export async function compressImageToJpeg(
  buffer: Buffer,
  options: Partial<CompressImageOptions> = {},
): Promise<Buffer> {
  const { width, height, quality } = { ...DEFAULT_OPTIONS, ...options };

  return await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality })
    .toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}
