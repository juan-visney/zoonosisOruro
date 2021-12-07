const model = require('../models/mascotaModel')
const helpers = require('../../config/helpers')
const adopcionModel = require('../models/adopcionModel')
const adoptante = require('../models/adoptanteModel')
const controller = {}

controller.registrar = async (req, res) => {
    const estado = 'recuperacion'
    const {idUsuario, especie, color, foto, edad, sexo} = req.body
    const nuevo = {idUsuario, especie, color, estado, foto, edad, sexo}
    var respuesta = await model.insertar(nuevo)
    if(respuesta!='error'){
        req.flash('success','Se ha registrado la mascota')
    }
    else
        req.flash('message',"Algo salio mal")
    res.redirect('/operador/')
}

controller.mascota = async(idMascota) => {
    return await model.buscar(idMascota)
}

controller.actualizarEstado = async(estado, id) => {
    return await model.actualizarEstado(id, estado)
}

controller.adoptados = async(req, res) => {
    return await model.adoptados()
}

controller.listar = async(req, res) => {
    const mascotas = await model.listar()
    return mascotas
}

controller.verMascota = async(req, res) => {
    const id = req.params.id
    console.log(id)
    const mascota = await model.listarMascota(id)
    console.log(mascota)
    res.render('./mascota/adopcion', mascota[0])
}

controller.getMascota = async(req, res) => {
    const mascotas = await model.adopciones();
    return mascotas
}

controller.solicitud = async(req, res) => {
    const idMascota = req.params.id
    const {nombre, celular, direccion, latitud, longitud, carnet} = req.body
    const persona = {nombre, celular, direccion, latitud, longitud, carnet}
    var result = await adoptante.insertar(persona)
    const idAdoptante = result
    const estado = 'pendiente'
    const tipo = 'adoptado'
    const nuevo = {idAdoptante, idMascota, estado, tipo}
    const adoptado = await adopcionModel.insertar(nuevo)
    if(adoptado){
        await model.pendiente(idMascota)
        req.flash('success','Pase por nuestras oficinas con su CI y papeleta de luz o agua para verificar sus datos')
    }
    else{
        req.flash('message','No se pudo completar la adopcion por favor pase nuestras oficinas')
    }
    res.redirect('/verMascotas')
}

module.exports = controller