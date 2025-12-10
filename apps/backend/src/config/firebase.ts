import { initializeApp, getApps } from "firebase-admin/app";

// Default Storage bucket for the project
export const DEFAULT_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "image-cook.appspot.com";

// Initialise Firebase Admin SDK
export function initialiseFirebaseAdmin() {
  // Only initialise if not already initialised
  if (getApps().length === 0) {
    initializeApp({
      storageBucket: DEFAULT_BUCKET,
    });
  }
}
