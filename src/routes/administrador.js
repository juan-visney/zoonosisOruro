const express = require('express')
const router = express.Router()
const passport = require('passport')
const {estaLogueado, noestaLogueado} = require('../config/authentication')
const usuarioController = require('../app/controllers/usuarioController')
const mascotaController = require('../app/controllers/mascotaController')
const session = require('express-session')
const PDFDocument = require('../config/pdfkit-table')

router.get('/', (req, res) => {
    res.render('./administrador/index')
})

router.get('/listarPersonal', estaLogueado, async (req, res) => {
    const usuario = await usuarioController.listarPersonal()
    res.render('./administrador/listarEmpleados', {usuario})
})

router.get('/modificarPersonal/:id', estaLogueado, async(req, res) => {
    const idUsuario = req.params.id
    const usuario = await usuarioController.obtenerUsuario(idUsuario)
    const cargo=usuario[0].cargo
    console.log(cargo)
    console.log(usuario)
    if(cargo=='administrador')
        res.render('./administrador/modificarAdministrador', usuario[0])
    else if(cargo=='operador')
        res.render('./administrador/modificarOperador', usuario[0])
    else if(cargo=='empleado')
        res.render('./administrador/modificarEmpleado', usuario[0])
})

router.get('/darBaja/:id', estaLogueado, async(req, res) => {
    const idUsuario = req.params.id
    const baja = await usuarioController.darBaja(idUsuario)
    if(baja)    
        req.flash('success','Se ha dado de baja al usuario')
    else 
        req.flash('message','Algo salio mal')
    res.redirect('/administrador/listarPersonal')
})

router.post('/modificarUsuario/:id', estaLogueado, async(req, res) => {
    console.log(req.params)
    const idUsuario = req.params.id
    const {nombre, cargo, ci, celular, foto} = req.body
    const persona = {idUsuario, nombre, cargo, ci, celular, foto}
    if(req.body.cargo=='administrador' || req.body.cargo=='operador'){
        persona.clave = req.body.clave
    }
    console.log(persona)
    resp = await usuarioController.modificar(persona)
    if(resp)
        req.flash('success','Se ha modfiicado los datos')
    else
        req.flash('message','Algo salio mal')
    res.redirect('/administrador/listarPersonal')
})

router.get('/reporteMascotas', estaLogueado, usuarioController.reporteMascota)

router.get('/reporteRechazos', estaLogueado, usuarioController.reporteRechazo)

router.get('/reporteGenero', estaLogueado, usuarioController.reporteGenero)

router.get('/campania', estaLogueado, async(req, res) => {
    const mascotas = await mascotaController.getMascota()
    res.render('./administrador/campanias', {mascotas})
})

router.get('/generarExcel', estaLogueado, usuarioController.generarExcel)

module.exports = router