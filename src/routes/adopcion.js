const express = require('express')
const mascotaController = require('../app/controllers/mascotaController')
const adopcionController = require('../app/controllers/adopcionController')
const router = express.Router()

router.post('/adoptar/:id', mascotaController.verMascota)

router.post('/solicitud/:id', mascotaController.solicitud)

router.get('/pendientes', async(req, res) => {
    const adopcion = await adopcionController.pendientes()
    res.render('./operador/adopcionesPendientes',{adopcion})
})

router.get('/entrega/:id', async(req, res) => {
    const idAdopcion = req.params.id
    adopcionController.entrega(req, res, idAdopcion)
})

router.get('/cancelar/:id', async(req,res) => {
    const idAdopcion = req.params.id
    adopcionController.cancelar(req, res, idAdopcion)
})

module.exports = router