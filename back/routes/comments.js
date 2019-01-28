const express = require('express');
const router = express.Router();
const connection = require('../secret');
const exjwt = require('express-jwt');
require('dotenv').load();

const jwtMW = exjwt({
    secret: process.env.JWT_SECRET_KEY
  });

// Get all comments linked to an article
router.get('/witharticles', (req, res) => {
    connection.query('SELECT * FROM comments, articles WHERE comments.articles_idarticles = articles.idarticles AND articles.isActive = 1', (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de la récupération des commentaires")
        } else {
            res.status(200).json(results)
        }   
    });
});

//Get all comments linked to a user
router.get('/withusers', (req, res) => {
    connection.query('SELECT * FROM comments, users WHERE comments.users_idusers = users.idusers AND users.isVisible = 1', (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de la récupération des commentaires")
        } else {
            res.status(200).json(results)
        }   
    });
});

//Post a comment
router.post('/', jwtMW, (req, res) => {          //jwtMW : middleware qui autorise la route seulement si on a un token
    const { content, idarticle } = req.body;
    connection.query('INSERT INTO comments (content, users_idusers, articles_idarticles) VALUES (?, ?, ?)', [content, req.user.id, idarticle], (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).json(results)
        }
    });
});


module.exports = router;