const User = require('../models/User');
const cloudinary = require('../utils/cloudinaryConfig');

// GET the logged-in user's own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// UPDATE profile info (name, phone, blood group, address)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bloodGroup, address } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.bloodGroup = bloodGroup || user.bloodGroup;
    user.address = address || user.address;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// UPLOAD profile picture - receives a base64 image string and uploads to Cloudinary
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { image } = req.body; // base64 image string sent from frontend

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'she-shield-profiles',
    });

    const user = await User.findById(req.userId);
    user.profilePicture = uploadResult.secure_url;
    await user.save();

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: uploadResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload picture', error: error.message });
  }
};