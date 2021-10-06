const express = require('express');
const app = express();
const pool = require("./../db");

exports.get_all_activity = async(req, res) => {
    try {
        const get_all_activity = await pool.query("SELECT * FROM study");

        res.json(get_all_activity.rows);
    } catch(err) {
        console.error(err.message)
    };
};

exports.add_activity = async(req, res) => {
    try {
        const { description, date, duration, type} = req.body
        const add_activity = await pool.query("INSERT INTO study (description, date, duration, type) VALUES ($1, $2, $3, $4) RETURNING *",
        [description, date, duration, type]);

        res.json(add_activity.rows[0]);
    } catch(err) {
        console.error(err.message)
    };
};

exports.delete_activity = async(req, res) => {
    try {
        const { id } = req.params;
        const delete_activity = await pool.query("DELETE FROM study WHERE study_id=($1)", [id]);

        res.json(`Activity study_id ${id} has been deleted.`)
    } catch(err) {
        console.error(err.message)
    }
};

exports.get_activity = async(req, res) => {
    try {
        const { id } = req.params;
        const get_activity = await pool.query("SELECT * FROM study WHERE study_id=($1)", [id]);

        res.json(get_activity.rows[0])
    } catch(err) {
        console.error(err.message)
    }
};

exports.edit_activity = async(req,res) => {
    try {
        const { id } = req.params;
        const { description, date, duration, type } = req.body;
        const edit_activity = await pool.query("UPDATE study SET description=($1), date=($2), duration=($3), type=($4) WHERE study_id=($5)",
        [description, date, duration, type, id])

        res.json(`Activity study_id ${id} has been updated.`)
    } catch(err) {
        console.error(err.message);
    }
};

exports.get_date_activity = async(req, res) => {
    try {
        const { date } = req.params;
        const d = date.substring(0,2) + '/' + date.substring(2,4) + '/' + date.substring(4,8);
        const get_date_activity = await pool.query("SELECT * FROM study WHERE date=($1)", [d]);

        res.json(get_date_activity.rows)
    } catch(err) {
        console.error(err.message)
    }
};
