import producto from '../models/producto.js';
import mongoose from 'mongoose';
import axios from 'axios';

const externalApiUrl = 'https://api-catalogo-pdf.onrender.com/api/productos';
const strapiApiUrl = 'http://localhost:1337/api/productos'; // Cambia esto si tu Strapi no está en localhost
const strapiToken = (process.env.STRAPI_TOKEN); // Reemplaza con tu token de autenticación

export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new producto(req.body);
    const ProductoGuardado = await nuevoProducto.save();
    
    // Sincronizar con Strapi
    await axios.post(strapiApiUrl, { data: ProductoGuardado }, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

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

export const actualizarProducto = async (req, res) => {
  try {
    const updatedProduct = await producto.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Sincronizar con Strapi
    await axios.put(`${strapiApiUrl}/${req.params.id}`, { data: updatedProduct }, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const product = await producto.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Sincronizar con Strapi
    await axios.delete(`${strapiApiUrl}/${req.params.id}`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const importarDatos = async (req, res) => {
  try {
    const response = await axios.get(externalApiUrl);
    const productos = response.data;

    for (const productoData of productos) {
      let existingProduct = await producto.findOne({ id: productoData.id });
      if (existingProduct) {
        existingProduct = await producto.findByIdAndUpdate(existingProduct._id, productoData, { new: true });
      } else {
        const newProduct = new producto(productoData);
        await newProduct.save();
      }
    }

    res.status(200).json({ message: 'Datos importados correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
