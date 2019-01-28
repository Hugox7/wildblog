const express = require("express");
const router = express.Router();
const connection = require('../secret');
const exjwt = require ('express-jwt')

const jwtMw = exjwt({
    secret : process.env.JWT_SECRET_KEY
})

router.route('/')

    //routes articles

    //route qui affiche tous les articles
    .get((req, res) => {
        const sql = "SELECT * FROM articles, users WHERE users.idusers = articles.users_idusers AND isActive=1";
        connection.query(sql, (err, results) => {
            if (err) res.status(500).send("Erreur lors de la récupération des articles")
            else res.json(results);
        })
    })

    .post(jwtMw,(req, res) => {

        const { title, description, isActive, pictures, users_idusers } = req.body;
        const sql = "INSERT INTO articles (title, description, isActive, users_idusers) VALUES (?,?,1,?)";
        const table = [title, description, isActive, users_idusers];

        connection.query(sql, table, (err, results) => {

            const sql_2 = "INSERT INTO articles_has_pictures (articles_idarticles, pictures_idpictures) VALUES (?,?) ";
            const table_2 = [results.insertId, pictures];

            connection.query(sql_2, table_2, (err_2, results_2) => {
                if (err_2) res.status(500).send(err_2.message)
                else res.json(results_2)
            })
        })
    })

router.route('/:id')

    .put((req, res) => {
        const { id } = req.params;
        const { title, description, isActive, users_idusers } = req.body;
        const sql = "UPDATE articles SET title =?, description = ?, isActive = ?, users_idusers = ?";
        const table = [title, description, isActive, users_idusers, id];

        connection.query(sql, table, (err, results) => {
            if (err) res.status(500).send(err)
            else res.json(results)
        })
    })

    //route qui permert de désactiver un article
    .delete((req, res) => {
        const { id } = req.params;
        const sql = "UPDATE articles SET is_active = 0 WHERE id =?";

        connection.query(sql, id, (err, result) => {
            if (err) res.status(500).send("Erreur lors de la désactivation de l'image.")
            else res.json(result)
        })
    })

module.exports = router;