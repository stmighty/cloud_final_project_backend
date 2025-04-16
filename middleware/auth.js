const { admin, db } = require("../config/firebaseAdmin");

exports.protect = async (req, res, next) => {                   // only authenticated users can access certain routes.                  // this is where req.user is initialized
    let token;
  
    // Step 1: Extract the Bearer token from the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract the token part after 'Bearer'
    } else {
      // If no token is provided, return an unauthorized response
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
  
    // Step 2: Check if the token is null or missing
    if (!token || token === "null") {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
  
    try {
      // Step 3: Verify the Firebase token using Firebase Admin SDK
      console.log("token is", token);  //  to be commented
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid; // Extract the UID from the decoded token
  
      // Step 4: Fetch user details from Firestore using the UID
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) {
        // If the user does not exist in Firestore
        return res.status(404).json({ success: false, message: "User not found in Firestore" });
      }
  
      const userData = userDoc.data(); // Retrieve user data from Firestore
  
      // Step 5: Add user details to req.user for downstream middleware or route handlers
      req.user = {
        uid: uid,             // User ID from Firebase Authentication
        email: userData.email, // User email from Firestore
        displayName: userData.displayName, // User display name from Firestore
      };
  
      // console.log("User details added to req.user:", req.user); // to be commented
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      // Step 6: Handle errors (e.g., invalid token, verification issues)
      console.error("Error verifying Firebase token:", err);
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  };