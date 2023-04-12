const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'your_secret_key'; // replace with your own secret key
const refreshSecretKey = 'your_refresh_secret_key'; // replace with your own refresh secret key
const accessTokenExpireTime = '1h'; // access token expiration time
const refreshTokenExpireTime = '7d'; // refresh token expiration time
const refreshTokenStore = {}; // temporary store for refresh tokens

// middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// generate access token
const generateAccessToken = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: accessTokenExpireTime });
};

// generate refresh token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, refreshSecretKey, { expiresIn: refreshTokenExpireTime });
    refreshTokenStore[user.username] = refreshToken;
    return refreshToken;
};

// login route
router.post('/login', (req, res) => {
    // authenticate user and generate JWT tokens
    const { username, password } = req.body;
    // replace with your own authentication logic
    if (username === 'user1' && password === 'password' || username === 'user2' && password === 'password') {
        const user = { username };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// refresh token route
router.post('/refresh-token', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken || !(refreshToken in refreshTokenStore)) {
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
});

module.exports = router;
