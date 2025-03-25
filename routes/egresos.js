var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Egreso = mongoose.model('Egreso');
const Usuario = mongoose.model('Usuario');

//TODO Metodo para registrar un nuevo egreso
router.post('/egreso', async(req,res)=>{
    
    let usu = await Usuario.findOne({email:req.body.usuario});
    
    let egresoNew = new Egreso({
        categoria : req.body.categoria,
        cantidad : req.body.cantidad,
        fecha: req.body.fecha,
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
    });

    //console.log(usuario);

    //variables utilizadas para actualizar el saldo del usuario
    let egreso = req.body.cantidad;
    //console.log(usu);
    let saldoFin = usu.saldo - egreso;

    await Usuario.updateOne({email:req.body.usuario}, {saldo:saldoFin}, {new:true});

    
    await egresoNew.save();
    res.status(201).send({egresoNew, usu});
});

router.post('/consultarMesAct', async(req,res)=>{
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Meses van de 0 a 11

    // Parseo de las fechas
    const year = anio ? parseInt(anio, 10) : new Date().getUTCFullYear();
    const month = parseInt(mes, 10);

    if (isNaN(month) || month < 1 || month > 12) {
        return res.status(400).send("El mes debe estar entre 01 y 12.");
    }

    // Crear las fechas de inicio y fin del mes en UTC
    const fechaInicio = new Date(Date.UTC(year, month - 1, 1)); // El mes es 0-indexado
    const fechaFin = new Date(Date.UTC(year, month, 1)); // Primer día del siguiente mes

    // Obtener los ingresos del usuario en el rango de fechas especificado
    let egresos = await Egreso.find({
        usuario: req.body.usuario,
        fecha: {
            $gte: fechaInicio, $lt: fechaFin
        }
    });

    let categoriaEgresos = await Usuario.findOne({email: req.body.usuario});

    // Obtener las categorías de ingresos del usuario
    const categoriasEgreso = categoriaEgresos.categoriasEgreso;
    //console.log(categoriasIngreso);
    // Crear un objeto para almacenar los totales por categoría
    const totales = {};

    // Iterar sobre las categorías y sumar los ingresos correspondientes
    categoriasEgreso.forEach(categoriaEgresos => {
        const categoria = categoriaEgresos.categoria;
        //console.log(categoria);
        const egresosCategoria = egresos.filter(egreso => egreso.categoria === categoria);
        //console.log(ingresosCategoria);
        const totalCategoria = egresosCategoria.reduce((sum, egreso) => sum + egreso.cantidad, 0);
        //console.log(totalCategoria);
        // Agregar la categoría y su total al objeto `totales`
        totales[categoria] = totalCategoria;
        //console.log(totales);
    });

    // Enviar el objeto `totales` como respuesta
    res.status(201).send({ totales , egresos});

    //let usuario = await Usuario.findOne({email : req.body.usuario});

});


module.exports = router;