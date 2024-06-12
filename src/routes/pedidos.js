import express from 'express';
import { crearPedido, obtenerPedido} from '../controllers/pedidoContraller.js';

const router = express.Router();

router.post('/pedidos', crearPedido);
router.get('/pedidos', obtenerPedido);

export default router;
