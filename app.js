const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes); // add authentication-related routes
app.use('/upload', uploadRoutes); // add file upload-related routes

const verifyToken = require('./middleware/verifyToken'); // import the verifyToken middleware

app.get('/', verifyToken, (req, res) => {
    res.send('Welcome')
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});