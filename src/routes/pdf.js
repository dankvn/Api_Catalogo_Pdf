
import express from 'express';
import { obtenerpdf } from '../controllers/pdf.js';

const router = express.Router();

router.get('/pdf', obtenerpdf);

export default router;
