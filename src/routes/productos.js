import express from 'express';
import { crearProducto, obtenerProducto,buscarProducto} from '../controllers/productoController.js';

const router = express.Router();

router.post('/productos', crearProducto);
router.get('/productos', obtenerProducto);
router.get('/productos/search', buscarProducto);
export default router;
