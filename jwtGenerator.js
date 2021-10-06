const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, user, admin) => {
    const payload = {
        id: id,
        user: user,
        admin: admin
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: 60 * 60})
}

module.exports = generateToken;
