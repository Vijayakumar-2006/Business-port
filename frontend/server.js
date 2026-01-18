const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle feedback submission
app.post('/save-feedback', (req, res) => {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email address');
    }

    // Sanitize inputs (basic prevention, though not strictly necessary for text file storage, good practice)
    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Format feedback entry
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const separator = '='.repeat(60);
    const feedbackEntry = `\n${separator}\nDate: ${timestamp}\nName: ${safeName}\nEmail: ${safeEmail}\nMessage:\n${safeMessage}\n${separator}\n`;

    // File path
    const filePath = path.join(__dirname, 'feedback.txt');

    // Append to file
    fs.appendFile(filePath, feedbackEntry, (err) => {
        if (err) {
            console.error('Error saving feedback:', err);
            return res.status(500).send('Error saving feedback');
        }
        console.log('Feedback saved successfully');
        res.status(200).send('Feedback saved successfully');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
