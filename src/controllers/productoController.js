import Producto from '../models/producto.js';

export const crearProducto = async (req, res) => {
    try {
      const nuevoProducto = new Producto(req.body);
      const ProductoGuardado = await nuevoProducto.save();
      res.status(201).send(ProductoGuardado);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  export const obtenerProducto = async (req, res) => {
    try {
      const productos = await Producto.find();
      res.status(200).send(productos);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }; 