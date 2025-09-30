const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(bodyParser.json());

// Firebase Admin Initialization
const serviceAccount = require('C:/Users/Namratha Kilari/OneDrive/Desktop/TRAVEL TALES/travel-tales-40327-firebase-adminsdk-fbsvc-81f4fc2b8f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    // You can now use the ID token
    console.log(idToken);
    // Send it with the request
  });
  
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'namrathakilari37@gmail.com',   // Your Gmail
    pass: 'bklp okfm nnce bmry'           // Your App Password
  }
});

// API to send email
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email not provided');
  }

  const mailOptions = {
    from: 'Travel Tales <namrathakilari37@gmail.com>',
    to: email,
    subject: 'Welcome to Travel Tales',
    text: 'Thank you for signing in! If this is not you, please report it to us.',
    html: '<h1>Thank you for signing in! If this is not you, please report it to us.</h1>',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).send('Failed to send email');
  }
});
app.post('/send-email', async (req, res) => {
    console.log("✅ Received POST request to /send-email");
    const userEmail = req.body.email;
  
    // your email sending logic here
    try {
      const result = await sendMail(userEmail);
      res.status(200).send('Email sent successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to send email');
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
