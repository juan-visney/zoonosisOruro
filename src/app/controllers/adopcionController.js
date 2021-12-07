const model = require('../models/adopcionModel')
const helpers = require('../../config/helpers')
const mascotaController = require('../controllers/mascotaController')
const adoptanteController = require('../controllers/adoptanteController')
const controller = {}

controller.pendientes = async(req, res) => {
    const adopcion = await model.pendientes()
    const datos = []
    for(var i = 0 ; i < adopcion.length ; i++){
        var idAdoptante = adopcion[i].idAdoptante
        const adoptante = await adoptanteController.buscar(idAdoptante)
        var idMascota = adopcion[i].idMascota
        const mascota = await mascotaController.mascota(idMascota)
        const result = {}
        result.idAdopcion = adopcion[i].idAdopcion
        result.nombre = adoptante[0].nombre
        result.celular = adoptante[0].celular
        result.direccion = adoptante[0].direccion
        result.latitud = adoptante[0].latitud
        result.longitud = adoptante[0].longitud
        result.estado = adopcion[i].estado
        result.fechaAdopcion = adopcion[i].fechaAdopcion
        result.foto = mascota[0].foto
        datos.push(result)
    }
    return datos
}

controller.entrega = async(req, res, idAdopcion) => {
    const adopcion = await model.buscar(idAdopcion)
    const respuesta = await mascotaController.actualizarEstado('adoptado', adopcion[0].idMascota)
    const respuesta1 = await model.actualizarEstado('completado', idAdopcion)
    res.redirect('/adopcion/pendientes')
}

controller.cancelar = async(req, res, idAdopcion) => {
    const adopcion = await model.buscar(idAdopcion)
    console.log(adopcion[0])
    const res1 = await mascotaController.actualizarEstado('recuperacion',adopcion[0].idMascota)
    const res2 = await model.actualizarEstado('cancelado',idAdopcion)
    res.redirect('/adopcion/pendientes')
}

module.exports = controller