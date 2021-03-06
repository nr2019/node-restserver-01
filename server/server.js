require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


// Cuando hay un app.use es un middleware *
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())
app.use(require('./routes/usuario'));


//mongoose.connect('mongodb://localhost:27017/cafe', {useNewUrlParser: true}); 
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE');
    });
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});