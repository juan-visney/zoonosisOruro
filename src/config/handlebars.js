const { session } = require('passport')
const { format } = require('timeago.js')

const helpers = {}

helpers.timeago = (timestamp) => {
    return format(timestamp)
}
helpers.esAdministrador = (user) =>{
    return user.cargo == 'administrador'
}

helpers.esEmpleado = (user) =>{
    return user.cargo == 'empleado'
}
helpers.esOperador = (user) =>{
    return user.cargo == 'operador'
}

module.exports = helpers