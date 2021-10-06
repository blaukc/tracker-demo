const express = require('express');
const app = express();
const pool = require("./../db");

exports.get_all_exercises = async(req, res) => {
    try {
        const get_all_exercises = await pool.query("SELECT * FROM exercisetype");

        res.json(get_all_exercises.rows);
    } catch(err) {
        console.error(err.message)
    };
};

exports.add_exercise = async(req, res) => {
    try {
        const { type, multiplier } = req.body
        const add_exercise = await pool.query("INSERT INTO exercisetype (type, multiplier) VALUES ($1, $2) RETURNING *",
        [type, multiplier]);

        res.json(add_exercise.rows[0]);
    } catch(err) {
        console.error(err.message)
    };
};

exports.delete_exercise = async(req, res) => {
    try {
        const { id } = req.params;
        const delete_exercise = await pool.query("DELETE FROM exercisetype WHERE exercisetype_id=($1)", [id]);

        res.json(`Activity exercisetype_id ${id} has been deleted.`)
    } catch(err) {
        console.error(err.message)
    }
};

exports.get_exercise = async(req, res) => {
    try {
        const { id } = req.params;
        const get_exercise = await pool.query("SELECT * FROM exercisetype WHERE exercisetype_id=($1)", [id]);

        res.json(get_exercise.rows[0])
    } catch(err) {
        console.error(err.message)
    }
};

exports.edit_exercise = async(req,res) => {
    try {
        const { id } = req.params;
        const { type, multiplier } = req.body;
        const edit_exercise = await pool.query("UPDATE exercisetype SET type=($1), multiplier=($2) WHERE exercisetype_id=($3)",
        [type, multiplier, id])

        res.json(`Activity exercisetype_id ${id} has been updated.`)
    } catch(err) {
        console.error(err.message);
    }
};
