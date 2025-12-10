import { app } from './app';
import { initialiseFirebaseAdmin } from './config/firebase';

const PORT = process.env.PORT || 8531;

initialiseFirebaseAdmin();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
