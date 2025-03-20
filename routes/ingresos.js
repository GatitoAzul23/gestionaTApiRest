var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Ingreso = mongoose.model('Ingreso');
const Usuario = mongoose.model('Usuario');

//TODO Metodo para registrar un nuevo ingreso
router.post('/ingreso', async(req,res)=>{
    let usuario = await Usuario.findOne({email:req.body.email});

    let ingresoNew = new Ingreso({
        categoria : req.body.categoria,
        cantidad : req.body.cantidad,
        fecha: req.body.fecha,
        descripcion: req.body.descripcion
    });

    //variables utilizadas para actualizar el saldo del usuario
    let ingreso = req.body.cantidad;
    let saldoFin = usuario.saldo + ingreso;

    await Usuario.updateOne({email:req.body.email}, {saldo:saldoFin}, {new:true});

    await ingresoNew.save();
    res.status(201).send({ingresoNew, usuario});
});

module.exports = router;