import express from 'express';
import { crearProducto, obtenerProducto} from '../controllers/productoController.js';

const router = express.Router();

router.post('/productos', crearProducto);
router.get('/productos', obtenerProducto);

export default router;
