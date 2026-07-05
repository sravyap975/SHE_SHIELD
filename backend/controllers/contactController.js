const Contact = require('../models/Contact');

// GET all contacts for the logged-in user
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

// CREATE a new contact (max 5 per user)
exports.addContact = async (req, res) => {
  try {
    const { name, phone, relationship, email } = req.body;

    // Enforce the max 5 contacts rule
    const existingCount = await Contact.countDocuments({ user: req.userId });
    if (existingCount >= 5) {
      return res.status(400).json({ message: 'You can only save up to 5 emergency contacts' });
    }

    const contact = await Contact.create({
      user: req.userId,
      name,
      phone,
      relationship,
      email,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add contact', error: error.message });
  }
};

// UPDATE an existing contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relationship, email } = req.body;

    // Make sure the contact belongs to the logged-in user before updating
    const contact = await Contact.findOne({ _id: id, user: req.userId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.relationship = relationship || contact.relationship;
    contact.email = email || contact.email;

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact', error: error.message });
  }
};

// DELETE a contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOneAndDelete({ _id: id, user: req.userId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
};