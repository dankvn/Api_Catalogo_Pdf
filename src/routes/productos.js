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

router.get('/', obtenerProducto);
router.post('/productos', crearProducto);
router.put('/productos/:id', actualizarProducto);
router.delete('/productos/:id', eliminarProducto);
router.get('/productos/search', buscarProducto);
router.post('/import', importarDatos);

export default router;
