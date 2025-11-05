//Bad code
const express = require('express');
const app = express();
const helmet = require ('helmet');
const rateLimit = require('express-rate-limit');

app.use(express.json());   // Needed for parsing JSON request bodies
app.use(express.json({limit: '10kb'}));
app.use(helmet());


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});
// users should have a few chances or they might get frustrated and go to a competitor

const users = [		// Simulated user data with plain text passwords (insecure)
    {id: 1, username: 'admin-secret-name', password: 'password123'},
    {id: 2, username: 'user', password: '123password'} ];
// predictable usernames like "admin"
// should not allow the word password

const PEPPER = process.env.PASSWORD_PEPPER || '';
// adding the pepper, salt and hash makes a password unbreakable.
// Use one pepper for all passwords within an org or system.
// If the pepper is compromised, everyone in that system needs a PW reset.


function validateLogin(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return {valid: false, error: 'Invalid username and password'};
    }
    var username = body.username;
    var password = body.password;

    if (!username || !password) {
        return {valid: false, error: 'Invalid username and password'};
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return {valid: false, error: 'Invalid username and password'};
    }
     var trimmedUsername = username.trim();
    if (trimmedUsername.normalize) {
        trimmedUsername = trimmedUsername.normalize('NFC');
    }

    if (trimmedUsername.length === 0) {
        return {valid: false, error: 'Username cannot be empty'};
    }
    if (trimmedUsername.length > 50) {
        return {valid: false, error: 'Username too long bro'};
    }
    if (password.length < 8) {
        return {valid: false, error: 'Password too short bro'};
    }
    if (password.includes('password')) {
        return {valid: false, error: 'Password cannot contain the word "password"'};
    }
    if (password.length > 20) {
        return {valid: false, error: 'Password too long bro'};
    }

    var usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
        return {valid: false, error: 'Invalid username format'};
    }

    return {valid: true, username: trimmedUsername, password: password};
}


app.post('/login', loginlimiter, (req, res) => {

app.listen(3000, () => console.log('Server running on port 3000')); // Start the server