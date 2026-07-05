const Report = require('../models/Report');

// CREATE a report - works whether logged in or fully anonymous
exports.createReport = async (req, res) => {
  try {
    const { incidentType, description, latitude, longitude, address, isAnonymous } = req.body;

    const report = await Report.create({
      user: isAnonymous ? null : req.userId || null,
      isAnonymous: isAnonymous !== false, // defaults to true unless explicitly set false
      incidentType,
      description,
      location: { latitude, longitude, address },
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit report', error: error.message });
  }
};

// GET all reports made by the logged-in user (only their non-anonymous ones)
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};