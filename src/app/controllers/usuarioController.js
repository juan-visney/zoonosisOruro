const model = require('../models/usuarioModel')
const path = require('path')
const helpers = require('../../config/helpers')
const passport = require('../../config/passport')
const excelbuilder = require('msexcel-builder')
const controlador = {}
const PDFDocument = require('../../config/pdfkit-table')

controlador.nuevoAdmin = async (req, res) => {
    const nombre = req.body.nombre
    const cargo = req.body.cargo
    const ci = req.body.ci
    const celular = req.body.celular
    const foto = req.body.foto
    const estado = 'activo'
    const nuevo = {
        nombre, cargo, ci, celular, foto, estado
    }
    if(req.body.cargo=='administrador' || req.body.cargo=='operador'){
        const cuenta = req.body.cuenta
        const clave = req.body.clave
        nuevo.cuenta = cuenta
        nuevo.clave = clave
    }
    const respuesta = await model.insertar(nuevo)
    if(respuesta!='error'){
        if(nuevo.cargo=='empleado')
            req.flash('success','Se ha registrado al empleado: '+nuevo.nombre)
        else 
            req.flash('success','Se ha creado la cuenta: '+nuevo.cuenta)
    }
    else
        req.flash('message',"Algo salio mal")
    res.redirect('/administrador/')
}

controlador.registrar = async (req, res) => {
    const nombre = req.body.nombre
    const cargo = req.body.cargo
    const ci = req.body.ci
    const celular = req.body.celular
    const foto = req.body.foto
    const estado = 'activo'
    const nuevo = {
        nombre, cargo, ci, celular, foto, estado
    }
    if(req.body.cargo=='administrador' || req.body.cargo=='operador'){
        const cuenta = req.body.cuenta
        const clave = req.body.clave
        nuevo.cuenta = cuenta
        nuevo.clave = clave
    }
    const respuesta = await model.insertar(nuevo)
    if(respuesta!='error'){
        if(nuevo.cargo=='empleado')
            req.flash('success','Se ha registrado al empleado: '+nuevo.nombre)
        else 
            req.flash('success','Se ha creado la cuenta: '+nuevo.cuenta)
    }
    else
        req.flash('message',"Algo salio mal")
    res.redirect('/administrador/')
}

controlador.listarPersonal = async(req, res) => {
    return await model.personal()
}

controlador.generarExcel = async(req, res) => {
    var workbook = excelbuilder.createWorkbook(path.join(__dirname,'test.xlsx'))
    var sheet1 = workbook.createSheet('sheet1', 10, 12)
    // Fill some data
    sheet1.set(1, 1, 'I am title');
    for (var i = 2; i < 5; i++)
        sheet1.set(i, 1, 'test'+i);
    
    // Save it
    console.log(sheet1)
    workbook.save(function(ok){
        console.log('workbook saved ' + (ok?'ok':'failed'));
      });

    res.send("Generando excel")
}

controlador.obtenerUsuario = async(idUsuario) => {
    return await model.obtenerUsuario(idUsuario)
}

controlador.darBaja = async(idUsuario) => {
    return await model.actualizarEstado('inactivo', idUsuario)
}

controlador.modificar = async(persona) => {
    return await model.actualizar(persona)
}

controlador.reporteMascota = async(req, res, next) => {
        model.reporteMascota()
            .then(mascotas => {
                const tabla = {
                    headers: ['Especie', 'edad'],
                    rows: mascotas
                };
                var myDoc = new PDFDocument({ bufferPages: true });
                let buffers = [];
                myDoc.on('data', buffers.push.bind(buffers));
                myDoc.on('end', () => {
                    let pdfData = Buffer.concat(buffers);
                    res.writeHead(200, {
                        'Content-Length': Buffer.byteLength(pdfData),
                        'Content-Type': 'application/pdf'
                    })
                        .end(pdfData);
                });
                myDoc.font('Helvetica-Bold')
                    .fontSize(25)
                    .text('Listado de mascotas', 135, 85);
                myDoc.table(tabla, {
                    prepareHeader: () => myDoc.fontSize(13),
                    prepareRow: (row, i) => myDoc.fontSize(12)
                });
                myDoc.end();
            })
}

controlador.reporteRechazo = async(req, res, next) => {
    model.reporteRechazo('cancelado')
        .then(rechazos => {
            const tabla = {
                headers: ['Nombre', 'Especie','Fecha de Adopcion'],
                rows: rechazos
            };
            var myDoc = new PDFDocument({ bufferPages: true });
            let buffers = [];
            myDoc.on('data', buffers.push.bind(buffers));
            myDoc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf'
                })
                    .end(pdfData);
            });
            myDoc.font('Helvetica-Bold')
                .fontSize(25)
                .text('Listado de Adopciones Canceladas ', 135, 85);
            myDoc.table(tabla, {
                prepareHeader: () => myDoc.fontSize(13),
                prepareRow: (row, i) => myDoc.fontSize(12)
            });
            myDoc.end();
        })
}

controlador.reporteGenero = async(req, res, next) => {
    model.reporteGenero('completado')
        .then(genero => {
            const tabla = {
                headers: ['Especie', 'Genero','Cantidad'],
                rows: genero
            };
            var myDoc = new PDFDocument({ bufferPages: true });
            let buffers = [];
            myDoc.on('data', buffers.push.bind(buffers));
            myDoc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf'
                })
                    .end(pdfData);
            });
            myDoc.font('Helvetica-Bold')
                .fontSize(25)
                .text('Listado Generos Mas Adoptados', 135, 85);
            myDoc.table(tabla, {
                prepareHeader: () => myDoc.fontSize(13),
                prepareRow: (row, i) => myDoc.fontSize(12)
            });
            myDoc.end();
        })
}

module.exports = controlador