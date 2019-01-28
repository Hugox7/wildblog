const express = require("express");
const router = express.Router();
const connection = require('../secret');


router.route('/')

    //routes articles

    //route qui affiche tous les articles
    .get((req, res) => {
        const sql ="SELECT * FROM articles WHERE isActive=1";
        connection.query(sql, (err, results) => {
            if (err) res.status(500).send("Erreur lors de la récupération des articles")
            else res.json(results);
        })
    })

    .post((req, res) => {

        const { title, description, isActive, pictures } = req.body;
        const sql = "INSERT INTO articles (title, description, isActive) VALUES (?,?,1)";
        const table = [title, description, isActive];

        connection.query(sql,table, (err, results) => {
            
                const sql_2 = "INSERT INTO articles_has_pictures (articles_idarticles, pictures_idpictures) VALUES (?,?) ";
                const table_2 = [results.insertId, pictures];

                connection.query(sql_2,table_2, (err_2, results_2) => {
                        if (err_2) res.status(500).send(err_2.message)
                        else res.json(results_2)
                    })
            })
    })

module.exports = router;