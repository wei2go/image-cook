import { initializeApp, getApps } from "firebase-admin/app";

// Default Storage bucket for the project
export const DEFAULT_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "image-cook.firebasestorage.app";

// Initialise Firebase Admin SDK
export function initialiseFirebaseAdmin() {
  // Only initialise if not already initialised
  if (getApps().length === 0) {
    // Note: databaseId is NOT passed here, it's passed to getFirestore() instead
    initializeApp({
      storageBucket: DEFAULT_BUCKET,
    });
    console.log('Firebase initialized with bucket:', DEFAULT_BUCKET);
  }
}
