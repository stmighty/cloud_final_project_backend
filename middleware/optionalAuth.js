const { admin, db } = require("../config/firebaseAdmin");

exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null") {
    req.user = null; // No authentication, proceed as a guest
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      req.user = null;
      return next();
    }

    req.user = {
      uid: uid,
      email: userDoc.data().email,
      displayName: userDoc.data().displayName,
    };

    next();
  } catch (err) {
    console.error("Error verifying Firebase token:", err);
    req.user = null; // If token verification fails, treat the request as unauthenticated
    next();
  }
};
