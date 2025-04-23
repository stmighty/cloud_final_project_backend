exports.checkSecretToken = (req, res, next) => {
  const secretToken = req.headers["x-secret-token"];

  if (!secretToken || secretToken !== process.env.SECRET_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing secret token",
    });
  }

  next();
};
