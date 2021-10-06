const express = require("express");
const app = express();
const pool = require("../db");
const bcrypt = require("bcrypt");
const generateToken = require("../jwtGenerator")

exports.register = async(req, res) => {
    try {
        const { name, password, admin } = req.body;

        //check if user_name already used in db
        const checkUser = await pool.query("SELECT * FROM auth WHERE user_name=$1", [name]);

        if (checkUser.rows.length > 0) {
            return res.status(401).json("Username is already used.");
        }

        //use bcrypt to hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, saltRounds);

        //register name and password to db
        var response;
        if (admin) {
            response = await pool.query("INSERT INTO auth (user_name, user_password, admin) VALUES ($1, $2, $3) RETURNING *", [name, bcryptPassword, admin])
        } else {
            response = await pool.query("INSERT INTO auth (user_name, user_password) VALUES ($1, $2) RETURNING *", [name, bcryptPassword])
        }

        res.json(response.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error!");
    }
}

exports.login = async(req, res) => {
    try {
        const { name, password } = req.body;

        //check if user is in db
        const user = await pool.query("SELECT * FROM auth WHERE user_name=$1", [name]);

        if (user.rows.length === 0) {
            return res.status(401).json("Username or password is incorrect!");
        }

        const { id, user_name, user_password, admin } = user.rows[0];

        //compare passwords with bcrypt
        const match = await bcrypt.compare(password, user_password);
        if (!match) {
            return res.status(401).json("Username or password is incorrect!");
        }

        //generate and return jwttoken
        token = generateToken(id, user_name, admin);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error!");
    }
}

exports.verify = async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error!");
    }
}
