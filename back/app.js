const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const exjwt = require('express-jwt');
require('dotenv').load();

const users =  require('./routes/users');
const comments = require('./routes/comments');


app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())


app.use('/users', users)
app.use('/comments', comments)





app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));


