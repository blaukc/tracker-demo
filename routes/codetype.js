const express = require('express');
const app = express();
const pool = require("./../db");

exports.get_all_codes = async(req, res) => {
    try {
        const get_all_codes = await pool.query("SELECT * FROM codetype");

        res.json(get_all_codes.rows);
    } catch(err) {
        console.error(err.message)
    };
};

exports.add_code = async(req, res) => {
    try {
        const { type } = req.body
        const add_code = await pool.query("INSERT INTO codetype (type) VALUES ($1) RETURNING *",
        [type]);

        res.json(add_code.rows[0]);
    } catch(err) {
        console.error(err.message)
    };
};

exports.delete_code = async(req, res) => {
    try {
        const { id } = req.params;
        const delete_code = await pool.query("DELETE FROM codetype WHERE codetype_id=($1)", [id]);

        res.json(`Activity codetype_id ${id} has been deleted.`)
    } catch(err) {
        console.error(err.message)
    }
};

exports.get_code = async(req, res) => {
    try {
        const { id } = req.params;
        const get_code = await pool.query("SELECT * FROM codetype WHERE codetype_id=($1)", [id]);

        res.json(get_code.rows[0])
    } catch(err) {
        console.error(err.message)
    }
};

exports.edit_code = async(req,res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const edit_code = await pool.query("UPDATE codetype SET type=($1) WHERE codetype_id=($2)",
        [type, id])

        res.json(`Activity codetype_id ${id} has been updated.`)
    } catch(err) {
        console.error(err.message);
    }
};
