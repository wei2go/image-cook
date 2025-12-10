import "dotenv/config";
import { app } from "./app";
import { initialiseFirebaseAdmin } from "./config/firebase";

const PORT = process.env.PORT || 8531;

initialiseFirebaseAdmin();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Firebase bucket: ${process.env.STORAGE_BUCKET}`);
  console.log(`Firestore database ID: ${process.env.FIRESTORE_DATABASE_ID}`);
});
