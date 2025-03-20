var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');

const mongoose = require('mongoose');
const { ResultWithContextImpl } = require('express-validator/lib/chain');

const Usuario = mongoose.model('Usuario');

//!Usuarios registrados: email:aby.cima@gmail.com  pass: 123abc

//TODO Metodo para REGISTRO
router.post('/registro',
  [
  check("email").isEmail().withMessage("Correo invalido")
  
  ], 
  async (req, res)=>{
    let errores = validationResult(req);
    if(!errores.isEmpty()){
      return res.status(402).json({error: errores.array()});
    } 
    //comprobar que ambas contraseñas sean iguales
    else if(req.body.password != req.body.password_comprobar){
      return res.send("Las contraseñas no coinciden");
    }
    let salt = await bcrypt.genSalt(10);
    //ciframos la contraseña antes 
    let pass_cifrado = await bcrypt.hash(req.body.password, salt);
    let correo = req.body.email;
    let usuarioNew = new Usuario({
      email : correo.toLowerCase(),
      password : pass_cifrado,
      usuario: req.body.nomUsuario,
      tipo: "Basico",
      categoriasIngreso: req.body.categoriasIngreso,
      categoriasEgreso: req.body.categoriasEgreso,
      saldo: 0
    });
    await usuarioNew.save();
    res.status(201).send({usuarioNew});
  }
);

//? Metodo para LOGIN
router.post('/login',
  async (req,res)=>{
    let usu = await Usuario.findOne({email: req.body.email});
    if(!usu){
      return res.status(402).send("Usuario a contraseña incorrectos");
    }

    if(!await bcrypt.compare(req.body.password, usu.password)){
      return res.status(402).send("Usuario o contraseña invalidos");
    }
      let env = {
        email: usu.email,
        nomUsuario: usu.usuario,
        jwtoken: usu.generadorJWT()
      }
      return res.send({env});  
  }
);

//? Metodo para CAMBIAR CONTRASEÑA  
router.put('/actualizar', async (req,res)=>{
  let errores = validationResult(req);
        if(!errores.isEmpty()){
          return res.status(402).json({error: errores.array()});
        } 
  let usua = await Usuario.findOne({email: req.body.email});

  if(!await bcrypt.compare(req.body.password_ant, usua.password)){
    return res.send("Usuario no encontrado");
  }
  
  //busqueda del empleado  
  if(!usua){
    //si no este return detiene el proceso
    return res.status(402).send("Usuario no encontrado");
}
  //variables para el cifrado de contraseña
  let salt = await bcrypt.genSalt(10);
  let pass_cifrado = await bcrypt.hash(req.body.password, salt);

  let usu_mod = await Usuario.findOneAndUpdate(
      //requiere un parametro de filtrado de busqueda
      {email: req.body.email},
      //modificacion
      {
        password:pass_cifrado,
      },
      //retorna un objeto viejo(false) o nuevo(true)
      {
          new: true
      }
  );
  res.send({usu_mod});
});

//? Metodo de consulta de usuario
router.post('/consultar', async(req,res)=>{
  let perfil = await Usuario.findOne({email: req.body.email});
  if(!perfil){
    return res.send("No hay registros");
  }
  let usu = await Usuario.findOne({email: perfil.email});
  res.send({usu});
});



module.exports = router;
