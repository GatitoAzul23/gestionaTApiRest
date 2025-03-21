var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Ingreso = mongoose.model('Ingreso');
const Usuario = mongoose.model('Usuario');

//TODO Metodo para registrar un nuevo ingreso
router.post('/ingreso', async(req,res)=>{
    
    let usu = await Usuario.findOne({email:req.body.usuario});
    //console.log(req.body.usuario);

    let ingresoNew = new Ingreso({
        categoria : req.body.categoria,
        cantidad : req.body.cantidad,
        fecha: req.body.fecha,
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
    });

    //console.log(usuario);

    //variables utilizadas para actualizar el saldo del usuario
    let ingreso = req.body.cantidad;
    console.log(usu);
    let saldoFin = usu.saldo + ingreso;

    await Usuario.updateOne({email:req.body.usuario}, {saldo:saldoFin}, {new:true});

    
    await ingresoNew.save();
    res.status(201).send({ingresoNew, usu});
});

// //?Metodo para consultar los ingresos de un usuario en el mes actual
// router.post('/consultar', async(req,res)=>{

//         const fechaActual = new Date();
//         const anio = fechaActual.getFullYear();
//         const mes = fechaActual.getMonth() + 1; // Meses van de 0 a 11

        
//        //Se debe hacer un parseo de las fechas
//         const year = anio ? parseInt(anio, 10) : new Date().getUTCFullYear();
//         const month = parseInt(mes, 10);


//         if (isNaN(month) || month < 1 || month > 12) {
//             return res.status(400).send("El mes debe estar entre 01 y 12.");
//         }
        
//         // Crear las fechas de inicio y fin del mes en UTC
//         const fechaInicio = new Date(Date.UTC(year, month - 1, 1)); // El mes es 0-indexado
//         const fechaFin = new Date(Date.UTC(year, month, 1)); // Primer día del siguiente mes

        

//         let ingresos = await Ingreso.find({
//             usuario: req.body.email, 
//             fecha: {
//                 $gte: fechaInicio, $lt: fechaFin 
//             }
//         });

//     res.status(201).send({ingresos});
// });


router.post('/consultar', async(req,res)=>{

    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Meses van de 0 a 11

    
   //Se debe hacer un parseo de las fechas
    const year = anio ? parseInt(anio, 10) : new Date().getUTCFullYear();
    const month = parseInt(mes, 10);


    if (isNaN(month) || month < 1 || month > 12) {
        return res.status(400).send("El mes debe estar entre 01 y 12.");
    }
    
    // Crear las fechas de inicio y fin del mes en UTC
    const fechaInicio = new Date(Date.UTC(year, month - 1, 1)); // El mes es 0-indexado
    const fechaFin = new Date(Date.UTC(year, month, 1)); // Primer día del siguiente mes

    

    let ingresos = await Ingreso.find({
        usuario: req.body.usuario, 
        fecha: {
            $gte: fechaInicio, $lt: fechaFin 
        }
    });

    

    res.status(201).send({ingresos});
});




module.exports = router;