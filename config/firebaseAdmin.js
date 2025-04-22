const admin = require("firebase-admin");
const serviceAccountAuth = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountAuth),
});

const db = admin.firestore();
module.exports = { admin, db };

//