//************************************************
//  Puerto *
//************************************************
process.env.PORT = process.env.PORT || 3000;

//************************************************
//  Entorno
//************************************************
/* esta es una variable de proceso que me brinda HEROKU.
si está vacía, es porque estoy en desarrollo.
en este caso, si viene vacía es llenada con dev*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//************************************************
//  Base de datos 
//************************************************

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://basemdb:Base19!nuevo@cluster0-21tuj.mongodb.net/cafe';
}

// esta la invento yo
process.env.URLDB = urlDB;