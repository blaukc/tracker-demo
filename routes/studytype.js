const express = require('express');
const app = express();
const pool = require("./../db");

exports.get_all_studys = async(req, res) => {
    try {
        const get_all_studys = await pool.query("SELECT * FROM studytype");

        res.json(get_all_studys.rows);
    } catch(err) {
        console.error(err.message)
    };
};

exports.add_study = async(req, res) => {
    try {
        const { type } = req.body
        const add_study = await pool.query("INSERT INTO studytype (type) VALUES ($1) RETURNING *",
        [type]);

        res.json(add_study.rows[0]);
    } catch(err) {
        console.error(err.message)
    };
};

exports.delete_study = async(req, res) => {
    try {
        const { id } = req.params;
        const delete_study = await pool.query("DELETE FROM studytype WHERE studytype_id=($1)", [id]);

        res.json(`Activity studytype_id ${id} has been deleted.`)
    } catch(err) {
        console.error(err.message)
    }
};

exports.get_study = async(req, res) => {
    try {
        const { id } = req.params;
        const get_study = await pool.query("SELECT * FROM studytype WHERE studytype_id=($1)", [id]);

        res.json(get_study.rows[0])
    } catch(err) {
        console.error(err.message)
    }
};

exports.edit_study = async(req,res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const edit_study = await pool.query("UPDATE studytype SET type=($1) WHERE studytype_id=($2)",
        [type, id])

        res.json(`Activity studytype_id ${id} has been updated.`)
    } catch(err) {
        console.error(err.message);
    }
};
