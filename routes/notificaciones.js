var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Notificacion = mongoose.model('Notificacion');
const Usuario = mongoose.model('Usuario');

//? Registrar la notificacion
router.post('/nuevo', async(req,res)=>{
    let nuevaNoti = new Notificacion({
        fecha: req.body.fecha,
        mensaje: req.body.mensaje,
        frecuencia: req.body.frecuencia, 
        usuario: req.body.usuario,
        estatus: "Activo"
    });
    
    await nuevaNoti.save();
    res.status(201).send({nuevaNoti});
});

//?Consultar notificaciones
router.post('/consultarNot', async(req,res)=>{
    let notificacion = await Notificacion.find({usuario:req.body.usuario, estatus: "Activo"});
    //console.log(notificacion);
    if(!notificacion){
        return res.status(404).send("No hay notificaciones programadas")
    }
    
        return res.status(200).send({notificacion});
    
});


//?Eliminar notificacion (logico)
router.put('/eliminar', async (req,res)=>{
    let notificacionElim = await Notificacion.findOneAndUpdate(
        {fecha: req.body.fecha, mensaje: req.body.mensaje},
        {estatus: "Inactivo"},
        {new: true}
    );
    //console.log(notificacionElim);
    res.status(200).send({notificacionElim});
});

module.exports = router;