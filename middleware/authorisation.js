const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        //check header for token
        const token = req.header("token");
        if (!token) {
            res.status(401).json("Unauthorised!");
        }

        //check if token is valid
        const payload = jwt.verify(token, process.env.jwtSecret)

        //set req.id and req.admin
        req.id = payload.id;
        req.user = payload.user;
        req.admin = payload.admin;

        //next()
        next()

    } catch (err) {
        console.error(err.message);
        res.status(401).json("Unauthorised!");
    }
}
