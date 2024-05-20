const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/digitec', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Define a schema for contact form submissions
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  request: String
});

const Contact = mongoose.model('Contact', contactSchema);

// API to handle contact form submission
app.post('/contact', (req, res) => {
  const newContact = new Contact(req.body);
  newContact.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Contact request submitted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
