const nodemailer = require('nodemailer');

// Create a reusable email transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sends an emergency SOS email to a list of contact emails
const sendSosEmail = async (toEmails, userName, latitude, longitude, address) => {
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const mailOptions = {
    from: `"She Shield Alert" <${process.env.EMAIL_USER}>`,
    to: toEmails.join(','), // can send to multiple contacts at once
    subject: `🚨 EMERGENCY ALERT: ${userName} needs help!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e91e63; border-radius: 10px;">
        <h2 style="color: #e91e63;">🚨 Emergency SOS Alert</h2>
        <p><strong>${userName}</strong> has triggered an emergency alert and may need immediate help.</p>
        <p><strong>Location:</strong> ${address || 'Not available'}</p>
        <p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
        <p><a href="${mapsLink}" style="background-color: #e91e63; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Live Location on Map</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated alert sent by She Shield Women Safety App.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendSosEmail };