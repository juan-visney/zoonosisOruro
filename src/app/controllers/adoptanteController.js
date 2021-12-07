const model = require('../models/adoptanteModel')
const helpers = require('../../config/helpers')
const controller = {}

controller.buscar = async(id) => {
    return await model.buscar(id)
}

module.exports = controller