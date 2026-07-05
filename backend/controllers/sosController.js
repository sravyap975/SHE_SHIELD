const Contact = require('../models/Contact');
const { sendSosEmail } = require('../utils/emailService');
const SosHistory = require('../models/SosHistory');

// TRIGGER a new SOS alert - saves it to history
exports.triggerSos = async (req, res) => {
  try {
    const { latitude, longitude, address, note } = req.body;

    const sos = await SosHistory.create({
      user: req.userId,
      location: { latitude, longitude, address },
      note,
      status: 'triggered',
    });

    // Try sending an emergency email - if it fails, we still confirm the SOS was logged
    try {
      const User = require('../models/User');
      const user = await User.findById(req.userId);

      // Get all emergency contacts that have an email saved
      const contacts = await Contact.find({ user: req.userId, email: { $ne: '' } });
      const emailList = contacts.map((c) => c.email);

      // Always include the user's own email too, as a backup
      emailList.push(user.email);

      await sendSosEmail(emailList, user.name, latitude, longitude, address);
      sos.contactsNotified = emailList.length;
      await sos.save();
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      message: 'SOS alert triggered and logged successfully',
      sos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to trigger SOS', error: error.message });
  }
};

// GET all SOS history for the logged-in user
exports.getSosHistory = async (req, res) => {
  try {
    const history = await SosHistory.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch SOS history', error: error.message });
  }
};

// UPDATE status of an SOS alert (e.g., mark as resolved/cancelled)
exports.updateSosStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sos = await SosHistory.findOne({ _id: id, user: req.userId });
    if (!sos) {
      return res.status(404).json({ message: 'SOS record not found' });
    }

    sos.status = status;
    await sos.save();

    res.status(200).json({ message: 'SOS status updated', sos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update SOS status', error: error.message });
  }
};