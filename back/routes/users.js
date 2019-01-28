const express = require('express');
const router = express.Router();
const connection = require('../secret');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').load();


// Get all users 
router.get('/', (req, res) => {
    connection.query(`SELECT * FROM users`, (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).json(results)
        }
    });
});


//Get all active users
router.get('/active', (req, res) => {
    connection.query(`SELECT * FROM users WHERE isVisible = ?`, 1, (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).json(results)
        }
    });
});


//Get user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    connection.query('SELECT * FROM users WHERE idusers = ?', id, (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).json(results)
        }
    });
});

//Create a user
router.post('/register', (req, res) => {
    let { username, password, email, avatar, bio, firstName, lastName } = req.body
    connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (!results.length) {
            bcrypt.hash(password, 10, (err, hash) => {
                const sql = 'INSERT INTO users (username, password, email, role, createdAt, updatedAt, isVisible, avatar, bio, firstName, lastName) VALUES (?, ?, ?, ?, now(), now(), ?, ?, ?, ?, ?)';
                const secret = 'user';
                const table = [username, hash, email, secret, 1, avatar, bio, firstName, lastName]
                connection.query(sql, table, (err, results) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send("Erreur lors de la création de l'utilisateur")
                    } else {
                        res.status(201).json(results)
                    }   
                });
            });
        } else {
            res.status(500).send('Mail ou username déjà existant')
        }
    });
});

//update user
router.put('/modify/:id', (req, res) => {
    const { password, avatar, bio, firstName, lastName } = req.body;
    const id = req.params.id
    connection.query('UPDATE users SET password = ?, updatedAt = now(), avatar = ?, bio = ?, firstName = ?, lastName = ?', [password, avatar, bio, firstName, lastName], (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de la modification de l'utilisateur")
        } else {
            res.status(200).json(results)
        }   
    });
});

//delete user
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('UPDATE users SET isVisible = ?', 0, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de la suppression de l'utilisateur")
        } else {
            res.status(200).send('Utilisateur supprimé')
        }   
    });
});


// Login
router.post('/login', (req, res) => {
    let { username, password } = req.body
    connection.query('SELECT idusers, username, password FROM users WHERE username = ?', username, (err, results) => {
        if (!err && results.length > 0) {
            if (bcrypt.compareSync(password, results[0].password)) {
            let token = jwt.sign({ id: results[0].idusers, username: username}, process.env.JWT_SECRET_KEY, { expiresIn : 129600 })
            res.json({
                success: true,
                err: null,
                token,
                results
            })} else {
                    res.status(500).json({
                        success: false,
                        token: null,
                        err: "Mot de passe incorrect",
                        results,
                    })
            }
        } else {
            res.status(500).json({
                success: false, 
                token: null, 
                err: "Nom d'utilisateur inexistant",
                results
            })
        }
    });
});


// Login admin
router.post('/loginadmin', (req, res) => {
    let { username, password } = req.body
    const secret = 'admin'
    const sql = 'SELECT username, password FROM users WHERE username = ? AND role = ?';
    const table = [username, secret];
    connection.query(sql, table, (err, results) => {
        if (!err && results.length > 0) {
            if (bcrypt.compareSync(password, results[0].password)) {
            let token = jwt.sign({ id: results[0].idusers, username: username}, process.env.JWT_SECRET_KEY, { expiresIn : 129600 })
            res.json({
                success: true,
                err: null,
                token,
                results
            })} else {
                    res.status(500).json({
                        success: false,
                        token: null,
                        err: "Mot de passe incorrect",
                        results,
                    })
            }
        } else {
            res.status(500).json({
                success: false, 
                token: null, 
                err: "Nom d'utilisateur inexistant",
                results
            })
        }
    });
});

module.exports = router;