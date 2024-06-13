import Pedido from '../models/Pedido.js';
import Cliente from '../models/cliente.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import path from 'path';
import fs from 'fs';

// Función para crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { nombre, email, telefono, total, cliente_id } = req.body;

    // Verifica que los datos están presentes
    if ( !email || !telefono || !total || !cliente_id) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoPedido = new Pedido({ nombre, email, telefono, total, cliente_id });
    const pedidoGuardado = await nuevoPedido.save();
    
    // Obtiene el cliente asociado al pedido
    const cliente = await Cliente.findById(cliente_id);

    // Generar el PDF
    const pdfPath = path.join('src', 'pdfs', `pedido_${pedidoGuardado._id}.pdf`);
    const pdfDir = path.dirname(pdfPath);

    // Verificar si el directorio existe, si no, crearlo
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    await generatePDF(pedidoGuardado, pdfPath);

    // Guardar la ruta del PDF en el pedido
    pedidoGuardado.pdfPath = pdfPath;
    await pedidoGuardado.save();

    res.status(201).json({ pedido: pedidoGuardado, pdfPath });
  } catch (err) {
    console.error('[ERROR]:', err);
    res.status(400).send(err.message);
  }
};

// Función para obtener todos los pedidos
export const obtenerPedido = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).send(pedidos);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Función para obtener el PDF de un pedido
export const obtenerPedidoPDF = (req, res) => {
  const pdfPath = path.join(process.cwd(), 'src', 'pdfs', req.params.pdfPath);

  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).send({ message: 'PDF not found' });
  }
};
