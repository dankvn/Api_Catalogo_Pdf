import express from 'express';
import  {
    crearProducto,
    obtenerProducto,
    buscarProducto,
    actualizarProducto,
    eliminarProducto,
    importarDatos
  } from '../controllers/productoController.js';

const router = express.Router();

router.get('/products', obtenerProducto);
router.post('/products', crearProducto);
router.put('/products/:id', actualizarProducto);
router.delete('/products/:id', eliminarProducto);
router.get('/products/search', buscarProducto);
router.post('/import', importarDatos);

export default router;
