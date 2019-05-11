require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Cuando hay un app.use es un middleware
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Get Usuario');
});

app.post('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    let body = req.body;
    if (body.nombre === undefined) {
        //bad request
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/usuario/:id', function(req, res) {
    //res.send('Hola Mundo');
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    res.json('Delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});