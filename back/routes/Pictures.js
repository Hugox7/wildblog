const express = require("express");
const router = express.Router();
const connection = require("../secret");


router.route('/')

    .get((req, res) => {
        const sql = "SELECT * FROM pictures WHERE isActive =1";
        connection.query(sql, (err, results) => {
            if (err) res.status(500).send("Erreur lors de la récupération des images")
            else res.json(results)
        })
    })

    .post((req, res) => {
        const { link, title, description, isActive } =req.body;
        const sql = "INSERT INTO pictures (link, title, description, isActive) VALUES (?,?,?,1)";
        const table = [link, title, description, isActive];
        
        connection.query(sql,table, (err, results) => {
            if (err) res.status(500).send(err.message)
            else res.json(results)
        })

    })
module.exports = router;