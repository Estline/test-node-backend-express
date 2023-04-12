const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken'); // import the verifyToken middleware

// file upload route
router.post('/upload', verifyToken, (req, res) => {
    // handle file upload
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded');
    }
    const file = req.files.file;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    const filename = `${Date.now()}_${file.name}`;
    file.mv(path.join(uploadDir, filename), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send('File uploaded successfully');
    });
});

module.exports = router;
