const express = require("express");
const router = express.Router();
const connection = require("../secret");
const exjwt = require ('express-jwt')

const jwtMw = exjwt({
    secret : process.env.JWT_SECRET_KEY
})



router.route('/')

    .get((req, res) => {
        const sql = "SELECT * FROM pictures WHERE isActive =1";
        connection.query(sql, (err, results) => {
            if (err) res.status(500).send("Erreur lors de la récupération des images")
            else res.json(results)
        })
    })

    .post(jwtMw,(req, res) => {
        const { link, title, description, isActive } = req.body;
        const sql = "INSERT INTO pictures (link, title, description, isActive) VALUES (?,?,?,1)";
        const table = [link, title, description, isActive];

        connection.query(sql, table, (err, results) => {
            if (err) res.status(500).send(`Erreur lors de la création de l'article`)
            else res.json(results)
        })

    })

router.route('/:id')

    .put((req, res) => {
        const { id } = req.params;
        const { title, description, isActive, users_idusers } = req.body;
        const sql = "UPDATE pictures SET title =?, description = ?, isActive = ?, users_idusers = ?";
        const table = [title, description, isActive, users_idusers, id];

        connection.query(sql, table, (err, results) => {
            if (err) res.status(500).send(err)
            else res.json(results)
        })
    })

    //route qui permet de désactiver un article
    .delete((req, res) => {
        const { id } = req.params;
        const sql = "UPDATE pictures SET is_active = 0 WHERE id =?";

        connection.query(sql, id, (err, result) => {
            if (err) res.status(500).send("Erreur lors de la désactivation de l'image.")
            else res.json(result)
        })
    })


module.exports = router;