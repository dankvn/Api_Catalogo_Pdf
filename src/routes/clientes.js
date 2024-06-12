import express from 'express';
import { crearCliente, obtenerClientes } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/clientes', crearCliente);
router.get('/clientes', obtenerClientes);

export default router;
