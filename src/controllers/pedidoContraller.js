import Pedido from '../models/Pedido.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';


export const crearPedido = async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    const pedidoGuardado = await nuevoPedido.save();
    const cliente = await Cliente.findById(pedidoGuardado.cliente_id);

    // Crear y guardar el PDF
    const doc = new PDFDocument();
    const pdfPath = `./pdfs/pedido_${pedidoGuardado._id}.pdf`;
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(25).text('Factura', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Cliente: ${cliente.nombre}`);
    doc.text(`Email: ${cliente.email}`);
    doc.text(`Teléfono: ${cliente.telefono}`);
    doc.text(`Dirección: ${cliente.direccion.calle}, ${cliente.direccion.ciudad}, ${cliente.direccion.codigo_postal}, ${cliente.direccion.pais}`);
    doc.moveDown();
    doc.fontSize(20).text('Detalles del Pedido');
    doc.moveDown();
    pedidoGuardado.productos.forEach(producto => {
      doc.fontSize(16).text(`Producto: ${producto.producto_id}`);
      doc.text(`Cantidad: ${producto.cantidad}`);
      doc.text(`Precio Unitario: ${producto.precio_unitario}`);
      doc.moveDown();
    });
    doc.fontSize(16).text(`Total: ${pedidoGuardado.total}`);
    doc.end();

    res.status(201).json({ pedido: pedidoGuardado, pdfPath });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
export const obtenerPedido = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).send(pedidos);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
