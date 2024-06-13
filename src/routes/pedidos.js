
import express from 'express';
import { crearPedido, obtenerPedido,obtenerPedidoPDF} from '../controllers/pedidoContraller.js';


const router = express.Router();

router.post('/pedidos', crearPedido);
router.get('/pedidos', obtenerPedido);


router.get('/pdfs/:pdfPath', obtenerPedidoPDF);


export default router;
