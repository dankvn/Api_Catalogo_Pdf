import Pedido from '../models/pedido.js';
import Cliente from '../models/cliente.js';
import { generatePDF } from '../utils/generatePDF.js';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

// Función para crear un pedido y generar el PDF
export const crearPedido = async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    const pedidoGuardado = await nuevoPedido.save();

    // Obtener el cliente asociado
    const cliente = await Cliente.findById(pedidoGuardado.cliente_id);

    // Generar el PDF del pedido
    await generatePDF(pedidoGuardado, cliente);

    // Verificar la ruta del PDF
    const pdfPath = path.join(process.cwd(), 'src', 'pdfs', `pedido_${pedidoGuardado._id}.pdf`);
    console.log('Ruta del PDF:', pdfPath);

    // Intentar obtener el PDF usando Axios
    try {
      const pdfResponse = await axios.get(`http://localhost:80/src/pdfs/pedido_${pedidoGuardado._id}.pdf`);
      console.log('PDF Response Status:', pdfResponse.status);
    } catch (error) {
      console.error('Error al obtener el PDF:', error.message);
    }

    res.status(201).json(pedidoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Función para obtener un pedido por su ID
export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Función para obtener el PDF de un pedido por su ID
export const obtenerPedidoPDF = async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const pdfPath = path.join(process.cwd(), 'src', 'pdfs', `pedido_${pedidoId}.pdf`);

    // Verifica si el archivo PDF existe
    if (fs.existsSync(pdfPath)) {
      res.sendFile(pdfPath);
    } else {
      res.status(404).json({ message: 'PDF no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

