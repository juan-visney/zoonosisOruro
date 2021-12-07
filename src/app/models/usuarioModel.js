const pool = require('../../database')
const helpers = require('../../config/helpers')

const modelo = {}


modelo.buscarUsuario = async(usuario) => {
    data = await pool.query('select * from usuario where cuenta = ?', [usuario]);
    return data;
}

modelo.insertar = async(usuario) => {
    try{
        if(usuario.cargo!='empleado'){
            clave = await helpers.encrypt(usuario.clave)
            usuario.clave = clave
        }
        return await pool.query('insert into usuario set ?',[usuario])
    }
    catch(error){
        return 'error'
    }
}

modelo.actualizarEstado = async(estado,idUsuario) => {
    return await pool.query('update usuario set estado = ? where idUsuario = ?',[estado, idUsuario]);
}

modelo.actualizar = async(usuario) => {
    if(usuario.cargo=='empleado')
        return await pool.query('update usuario set nombre = ? , cargo = ?  , ci = ? ,  celular = ? , foto = ?  where idUsuario = ?',[usuario.nombre, usuario.cargo , usuario.ci, usuario.celular,usuario.foto,  usuario.idUsuario]);
    else
        return await pool.query('update usuario set nombre = ? , cargo = ?  , clave = ? , ci = ? ,  celular = ? , foto = ?  where idUsuario = ?',[usuario.nombre, usuario.cargo ,  usuario.clave, usuario.ci, usuario.celular,usuario.foto,  usuario.idUsuario]);
}

modelo.id = async(ci) => {
    return await pool.query('select idUsuario from ususario where ci = ?',[ci])
}

modelo.personal = async() => {
    const estado = 'activo'
    return await pool.query('select * from usuario where estado = ? ', [estado])
}

modelo.obtenerUsuario = async(idUsuario) => {
    return await pool.query('select * from usuario where idUsuario = ?', [idUsuario])
}

modelo.avector = (listaobjetos) => {
        var respuesta = [];
        listaobjetos.forEach(elemento => {
            respuesta.push (Object.values(elemento));
        });
        return respuesta;
    }

modelo.reporteMascota = () => {
    return new Promise ( (resolve, reject)=>{
        pool.query(
        'select especie as Especie, edad as Edad from mascota',
        (err, mascotas)=>{
            if(err) reject(err);
            else resolve(modelo.avector(mascotas))
        }
        )
    })
}

modelo.reporteRechazo = (estado) => {
    return new Promise ( (resolve, reject)=>{
        pool.query(
        'select a.nombre as Nombre, m.especie as Especie, c.fechaAdopcion as Fecha Adopcion from adoptante a, mascota m ,adopcion c where a.idAdoptante=c.idAdoptante and c.idMascota=m.idMascota and c.estado = ?',[estado],
        (err, rechazos)=>{
            if(err) reject(err);
            else resolve(modelo.avector(rechazos))
        }
        )

    })
}

modelo.reporteGenero = (estado) => {
    return new Promise ( (resolve, reject)=>{
        pool.query(
        'select m.especie as Especie, m.sexo as Genero, Count(*) as Cantidad  From mascota m, adopcion a where a.estado= ? and a.idMascota=m.idMascota group by m.especie, m.sexo order by Cantidad desc;',[estado],
        (err, genero)=>{
            if(err) reject(err);
            else resolve(modelo.avector(genero))
        }
        )
        
    })
}

module.exports = modelo
