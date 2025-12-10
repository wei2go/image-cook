import { getStorage } from "firebase-admin/storage";
import { normaliseEntityName } from "@image-cook/shared";
import { DEFAULT_BUCKET } from "../config/firebase";

export interface UploadResult {
  storagePath: string;
  publicUrl: string;
}

/**
 * Get public URL for a Storage file using Firebase Storage API format
 */
export function getPublicUrl(storagePath: string): string {
  const encodedPath = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${DEFAULT_BUCKET}/o/${encodedPath}?alt=media`;
}

/**
 * Get signed URL for a Storage file (works for private files)
 */
export async function getSignedUrl(storagePath: string): Promise<string> {
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return url;
}

/**
 * Make a file publicly readable
 */
export async function makeFilePublic(storagePath: string): Promise<void> {
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);
  await file.makePublic();
  console.log(`✓ Made public: ${storagePath}`);
}

/**
 * Upload winner image to Firebase Storage
 */
export async function uploadWinnerImage(
  buffer: Buffer,
  entityName: string,
  category: string,
): Promise<UploadResult> {
  const normalisedName = normaliseEntityName(entityName);
  const fileName = `${normalisedName}.jpg`;
  const storagePath = `winners/${category}/${fileName}`;

  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    contentType: "image/jpeg",
    metadata: {
      cacheControl: "no-cache, no-store, must-revalidate",
    },
  });

  // Make file publicly readable
  await file.makePublic();

  const publicUrl = getPublicUrl(storagePath);

  console.log(`✓ Uploaded winner: ${storagePath}`);

  return {
    storagePath,
    publicUrl,
  };
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);

  const [exists] = await file.exists();
  if (exists) {
    await file.delete();
    console.log(`✓ Deleted: ${storagePath}`);
  }
}

/**
 * Download file from Firebase Storage
 */
export async function downloadFile(storagePath: string): Promise<Buffer> {
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);

  const [buffer] = await file.download();
  return buffer;
}

/**
 * List files in Firebase Storage by prefix
 */
export async function listFiles(prefix: string): Promise<string[]> {
  const bucket = getStorage().bucket();
  const [files] = await bucket.getFiles({ prefix });
  return files.map((file) => file.name);
}
