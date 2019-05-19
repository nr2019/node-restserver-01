const mongoose = require('mongoose');
/* lo que me pide este plug es que defina que campo es obligatorio 
(ya lo hicimos poniendo el UNIQUE en el mail, luego hayq ue asociarlo al 
schema*/
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    // En este caso, el value contiene lo que el usuario envía
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        // no podrá existir 2 correos iguales
        unique: true,
        required: [true, 'El correo es necesario.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        require: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        /*El enum define un ambito de valores en el cual tiene que 
        estar ese valor, sino no lo acepta */
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

/* este método se llama cada vez que va a dar una respuesta
Me sirve para modificar el objeto de respuesta. no le quiero devolver 
la password*/
usuarioSchema.method.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

// En este caso PATH va a ser email, porque es el campo clave
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único.' });

// Una vez que definí todo el modelo, exporto el usuario
// este tendrá el esquema que amamos en usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);