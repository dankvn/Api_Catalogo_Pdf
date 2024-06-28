import Pedido from '../models/pedido.js';
import Cliente from '../models/cliente.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import path from 'path';
import fs from 'fs';

// Función para crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { nombre, email, telefono, estado, productos } = req.body;

    // Verifica que los datos están presentes
    if (!nombre || !email || !telefono || !estado || !productos) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear y guardar cliente
    const nuevoCliente = new Cliente({ nombre, email, telefono});
    const clienteGuardado = await nuevoCliente.save();

    // Calcular el precio total
    const precio_total = productos.reduce((total, producto) => total + (producto.cantidad * producto.precio_unitario), 0);

    // Crear pedido con cliente_id
    const nuevoPedido = new Pedido({
      cliente_id: clienteGuardado._id,
      estado,
      productos,
      precio_total
    });

    const pedidoGuardado = await nuevoPedido.save();

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
// Construir la URL pública del PDF
const pdfUrl = `http://localhost:80/api/pdfs/pedido_${pedidoGuardado._id}.pdf`;
    res.status(201).json({ pedido: pedidoGuardado, pdfPath });
  } catch (err) {
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

