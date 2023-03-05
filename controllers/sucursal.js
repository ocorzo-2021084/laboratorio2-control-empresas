const { request, response } = require('express');
const Sucursal = require('../models/sucursal');
const Empresa = require('../models/empresa');

const getSucursales = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

     const listaProducto = await Promise.all([
        Producto.countDocuments(query),
         Producto.find(query)
             //.populate('usuario', 'nombre')
             .populate('usuario', 'correo')
            .populate('categoria', 'nombre')
     ]);

     res.json({
        msg: 'get Api - Controlador Usuario',
         listaProducto
});

}

const getSucursalPorID = async (req = request, res = response) => {
    const _id = req.empresa.id;
    const query = { estado: true, empresa: _id };
  
    const listaEmpresas = await Promise.all([
      Sucursal.countDocuments(query),
      Sucursal.find(query).populate("empresa", "nombre",),
    ]);
  
    res.json({
      msg: "get Api - Controlador empresa",
      listaEmpresas,
    });
};

const postSucursal = async (req = request, res = response) => {

    const { estado, empresa, ...body } = req.body;

    const sucursalDB = await Sucursal.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if ( sucursalDB ) {
        return res.status(400).json({
            msg: `La sucursal ${ sucursalDB.nombre }, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        empresa: req.empresa._id
    }

    const sucursal = await Sucursal( data );

    //Guardar en DB
    await sucursal.save();

    res.status(201).json( sucursal );
   
}

const putSucursal = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, empresa, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.empresa = req.empresa._id;
    }

    const empresaActualizada = await Sucursal.findByIdAndUpdate(id, restoData, ({ new: true }));

    res.status(201).json({
        msg: 'Put Controller Sucursal',
        empresaActualizada
    });
}

const deleteSucursal = async (req = request, res = response) => {
    const { id } = req.params;
    const sucursalEliminada = await Sucursal.findByIdAndDelete(id);
  
    res.json({
      msg: "DELETE SUCURSAL",
      sucursalEliminada,
    });
};

module.exports = {
    postSucursal,
    getSucursalPorID,
    putSucursal,
    deleteSucursal
}