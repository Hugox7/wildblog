const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const port = process.env.PORT || 3002 //lors de la mise en prod de ton projet
// const connection = require ('./secret');
const pictures = require('./routes/Pictures')
const articles = require('./routes/Articles')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/pictures', pictures);
app.use('/articles', articles);


app.listen(port, err => {
    if (err) {
        throw new Error("Something bad happened...");
    }

    console.log(`Server is listening on ${port}`);
});