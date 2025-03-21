const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UsuarioSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    password:String,
    nomUsuario:String,
    tipo:String,
    categoriasIngreso:Array, 
    //Ingreso (categoria, cantidad, frecuencia, estatus)
    categoriasEgreso:Array, 
    //Egreso (categoria, activo)
    saldo:Number,
});

UsuarioSchema.methods.generadorJWT = function(){
    return jwt.sign({
        email: this.email,
        nomUsuario: this.nomUsuario,
    }, process.env.SECRET_KEY);
};


mongoose.model('Usuario', UsuarioSchema);