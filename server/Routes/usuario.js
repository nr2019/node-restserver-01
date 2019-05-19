const express = require('./node_modules/express');
const bcrypt = require('./node_modules/bcrypt');
const _ = require('./node_modules/underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res) {

    // si me envían el parámetro opcional "desde", uso ese, sino cero.
    // hay que validar que venga un número
    let desde = req.query.desde || 0;
    desde = Number(desde);
    /*Para enviar parámetros opcionales desde la URL, queda así
    {{url}}/usuario/?desde=10
    irl + ruta + singo interrogación + parámetro + = valor */

    let limite = req.query.limite || 5;
    // le hago el tipado a numérico
    limite = Number(limite);
    /*como van a venir más de un parámetro, en la url se concatenan con 
    &.       usuario?limite=10&desde?10 */

    /* el find es como el select where
    traer todos los registros de esa colección, ya que dentro del 
    Usuario.find({}) no le estoy indicando condiciones, 
    nombre email van a ser los campos que voy a leer*/
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // salta n registros
        .limit(limite) //me devuelve del 5 registroS 
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });

            };

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

            /*// si no hay error esto se ejecuta
            res.json({
                ok: true,
                usuarios: usuarios,
            });*/
        });
});

app.post('/usuario', function(req, res) {
    //res.send('Hola Mundo');
    let body = req.body;
    let usuario = new Usuario({
        /*al objeto (schema + mongoose) que acabo de declarar lo voy a llenar con lo que venga
        definido en el body*/
        nombre: body.nombre,
        email: body.email,
        // el 10 es la cantidad de vueltas que va a darle al encriptar 
        // hash de una sola via
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role
    });

    /*el SAVE ace que se grabe en base de datos el usuario, 
    en caso de que algo pinche me va a devolver un ERR, 
    si grabó bien, me va a devolver el usuario que acabo de crear */
    usuario.save((err, usuarioDB) => {

        //informe de error con un retorno del mensaje
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });

        }
        // no le quiero devolver el hash que creé
        usuarioDB.password = null;
        // si llegó acá es porque anda bien
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    /*  if (body.nombre === undefined) {
          //bad request
          res.status(400).json({
              ok: false,
              mensaje: 'El nombre es necesario'
          });
      } else {
          res.json({
              persona: body
          });
      }*/

});

app.put('/usuario/:id', function(req, res) {
    //res.send('Hola Mundo');
    let id = req.params.id;
    // el underscore pick me va a "filtrar" el objeto body, devolviendo SÓLAMENTE
    // los objetos que voy a estar modificando
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /*Usuario.findById( id, (err, usuarioDB) =>{

    });*/
    //ID: qué voy a actualizar
    // body: con qué voy a actualizar los datos
    // el new: true me devuelve el usuario actualizado. lo pongo entre {} pq es un objeto
    // el runValidators: true hace que se respeten las validaciones del Schema, 
    // sino no las respeta en el update
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        //informe de error con un retorno del mensaje
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });

        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado.'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});


module.exports = app;