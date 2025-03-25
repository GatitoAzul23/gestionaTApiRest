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
    //let egreso = {categoria: "Otro", estatus: "Activo"};
    let ingreso = {categoria:"Otro", cantidad:0, frecuencia:"Mensual" ,estatus:"Activo"};
    //console.log(req.body.nomUsuario);
    let usuarioNew = new Usuario({
      email : correo,
      password : pass_cifrado,
      nomUsuario: req.body.nomUsuario,
      //categoriasEgreso: egreso,
      categoriasIngreso: ingreso,
      tipo: "Basico",
      saldo: 0,
    });
    await usuarioNew.save();

    let usuaNuevo = {
      email: usuarioNew.email,
      nomUsuario: usuarioNew.nomUsuario,
      jwtoken: usuarioNew.generadorJWT(),
      tipo: usuarioNew.tipo
    }

    res.status(201).send({usuaNuevo});
    
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
        nomUsuario: usu.nomUsuario,
        jwtoken: usu.generadorJWT(),
        tipo: usu.tipo,
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


//? Metodo para CAMBIAR CONTRASEÑA  
router.put('/categorias', async (req,res)=>{
  
  let usua = await Usuario.findOne({email: req.body.email});

  //busqueda del empleado  
  if(!usua){
    //si no este return detiene el proceso
    return res.status(402).send("Usuario no encontrado");
}
 
  let usu_mod = await Usuario.findOneAndUpdate(
      //requiere un parametro de filtrado de busqueda
      {email: req.body.email},
      //modificacion
      {
        $push: {
          categoriasIngreso: req.body.categoriasIngreso,
          
        },
        $set:{
          categoriasEgreso: req.body.categoriasEgreso
        }
      },
      //retorna un objeto viejo(false) o nuevo(true)
      {
          new: true
      }
  );
  res.send({usu_mod});
});

 //? Metodo de consulta de usuario
// router.post('/consultar', async(req,res)=>{
//   let perfil = await Usuario.findOne({email: req.body.email});
//   if(!perfil){
//     return res.send("No hay registros");
//   }
//   let usu = await Usuario.findOne({email: perfil.email});
//   res.send({usu});
// });

router.post('/consultar', async(req,res)=>{
    let usu = await Usuario.findOne({email:req.body.email});
    if(!usu){
      return res.send("No hay registros");
    }
    const ingresos = usu.categoriasIngreso.filter(
      categoria => categoria.estatus === 'Activo'
    );
    
    // Corrección 2: Acceder a categoriasEgreso del usuario
    const egresos = usu.categoriasEgreso.filter(
      categoria =>  categoria.estatus === 'Activo'
    );

    // Corrección 3: Estructurar correctamente la respuesta
    const categoriasFiltradas = {
      ingreso: ingresos,
      egreso: egresos
    };
    res.send({usu, categoriasFiltradas});
  });


//?Metodo para ver categorias filtradas
router.post('/verCate', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email });
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

     // Corrección 1: Filtrar las categorías dentro del objeto usuario
    const ingresos = usuario.categoriasIngreso.filter(
      categoria => categoria.categoria !== 'Otro'
      && categoria.estatus === 'Activo'
    );
    
    // Corrección 2: Acceder a categoriasEgreso del usuario
    const egresos = usuario.categoriasEgreso.filter(
      categoria => categoria.categoria !== 'Otro'
      && categoria.estatus === 'Activo'
    );

    // Corrección 3: Estructurar correctamente la respuesta
    const categoriasFiltradas = {
      Ingresos: ingresos,
      Egresos: egresos
    };

    res.send({categoriasFiltradas});
    //console.log(categoriasFiltradas);
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

router.put('/nuevoIngreso', async(req,res)=>{
  let ingresoAgregar = await Usuario.findOneAndUpdate(
    //requiere un parametro de filtrado de busqueda
    {email: req.body.usuario},
    //modificacion
    {
      $push: {
        categoriasIngreso: req.body.categoriasIngreso, 
      }
    },
    //retorna un objeto viejo(false) o nuevo(true)
    {
        new: true
    }
  );
  //console.log(req.body.categoriasIngreso);
  res.send({ingresoAgregar});
});

router.put('/nuevoEgreso', async(req,res)=>{
  let egresoAgregar = await Usuario.findOneAndUpdate(
    //requiere un parametro de filtrado de busqueda
    {email: req.body.usuario},
    //modificacion
    {
      $push: {
        categoriasEgreso: req.body.categoriasEgreso,
        
      }
    },
    //retorna un objeto viejo(false) o nuevo(true)
    {
        new: true
    }
  );
  res.send({egresoAgregar});
});

router.put('/eliminaIng', async(req,res)=>{
  let ingresoElimina = await Usuario.findOneAndUpdate(
    //requiere un parametro de filtrado de busqueda
    {email: req.body.usuario, 'categoriasIngreso.categoria': req.body.categoria},
    //modificacion
    {
      $set: { 'categoriasIngreso.$.estatus': 'Inactivo' }
    },
    //retorna un objeto viejo(false) o nuevo(true)
    {
        new: true
    }
  );
  //console.log(req.body.email);
  //console.log(req.body.categoria);
  res.send({ingresoElimina});
});

router.put('/eliminaEgr', async(req,res)=>{
  let egresoElimina = await Usuario.findOneAndUpdate(
    //requiere un parametro de filtrado de busqueda
    {email: req.body.usuario, 'categoriasEgreso.categoria': req.body.categoria},
    //modificacion
    {
      $set: { 'categoriasEgreso.$.estatus': 'Inactivo' }
    },
    //retorna un objeto viejo(false) o nuevo(true)
    {
        new: true
    }
  );
  //console.log(req.body.email);
  //console.log(req.body.categoria);
  res.send({egresoElimina});
});


module.exports = router;
