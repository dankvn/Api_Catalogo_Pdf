import producto from '../models/producto.js';
import mongoose from 'mongoose';

export const crearProducto = async (req, res) => {
    try {
      const nuevoProducto = new producto(req.body);
      const ProductoGuardado = await nuevoProducto.save();
      res.status(201).send(ProductoGuardado);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  export const obtenerProducto = async (req, res) => {
    try {
      const productos = await producto.find();
      res.status(200).send(productos);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }; 
  export const buscarProducto = async (req, res) => {
    let { query } = req.query;
    console.log('Query recibido:', query); // Añade esta línea para depuración
    try {
      // Verificar si el query es un ID válido de MongoDB
      const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

      let productos;
      if (isValidObjectId) {
          // Buscar por ID si el query es un ID válido
          productos = await producto.find({ _id: query });
      } else {
          // Buscar por nombre utilizando una expresión regular para buscar coincidencias parciales y no distinguir mayúsculas de minúsculas
          productos = await producto.find({ nombre: { $regex: new RegExp(query, 'i') } });
      }

      // Si no se encontraron productos
      if (productos.length === 0) {
          return res.status(404).json({ message: 'No se encontraron productos que coincidan con la búsqueda.' });
      }

      // Si se encontraron productos, devolver la lista
      res.status(200).json(productos);
  } catch (error) {
      console.error('Error buscando productos:', error.message);
      res.status(500).json({ message: 'Error buscando productos', error: error.message });
  }
};