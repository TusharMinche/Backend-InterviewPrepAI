const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();
const {uploadImageToCloudinary} = require("../utils/imageUpload");

//Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

router.post("/upload-image", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const displayPicture = req.files.image;
    const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )

    const imageUrl = image.secure_url

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({message: "Server error. Can not upload image", error: error.message})
  }
});

module.exports = router;
