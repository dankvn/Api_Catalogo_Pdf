import PDFDocument from 'pdfkit';
import fs from 'fs';
import Cliente from '../models/cliente.js';

export const generatePDF = async (pedido, pdfPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cliente = await Cliente.findById(pedido.cliente_id);

      if (!cliente) {
        return reject(new Error('Cliente no encontrado'));
      }

      const doc = new PDFDocument({ margin: 30, layout: 'landscape', size: 'A4' });
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      // Estilos y colores
      const primaryColor = '#4A90E2';
      const secondaryColor = '#F5A623';
      const textColor = '#333333';

      // Agregar encabezado con color de fondo
      doc
        .rect(0, 0, doc.page.width, 60)
        .fill(primaryColor)
        .fillColor('white')
        .fontSize(24)
        .text('Orden de Consumo', 30, 20);

      doc.moveDown();

      // Información del cliente
      doc
        .fillColor(textColor)
        .fontSize(12)
        .text(`Pedido ID: ${pedido._id}`, 30, 80)
        .text(`Nombre: ${cliente.nombre}`)
        .text(`Email: ${cliente.email}`)
        .text(`Teléfono: ${cliente.telefono}`)
        .text(`Fecha de Pedido: ${new Date(pedido.fecha_pedido).toLocaleDateString()}`)
        .text(`Estado: ${pedido.estado}`)
        .moveDown();

      // Tabla de productos
      doc
        .fillColor(primaryColor)
        .fontSize(14)
        .text('Productos:', { underline: true })
        .moveDown(0.5);

      const tableTop = doc.y;
      const itemCodeX = 30;
      const descriptionX = 150;
      const quantityX = 300;
      const priceX = 400;
      const totalX = 500;

      // Headers
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(secondaryColor)
        .text('Producto', itemCodeX, tableTop)
        .text('Cantidad', quantityX, tableTop)
        .text('Precio Unitario', priceX, tableTop)
        .text('Total', totalX, tableTop);

      doc.moveDown();

      // Items
      let yPosition = tableTop + 25;
      doc.font('Helvetica').fontSize(10).fillColor(textColor);

      pedido.productos.forEach(producto => {
        doc
          .text(producto.nombre, itemCodeX, yPosition)
          .text(producto.cantidad, quantityX, yPosition, { width: 90, align: 'center' })
          .text(`$${producto.precio_unitario.toFixed(2)}`, priceX, yPosition, { width: 90, align: 'right' })
          .text(`$${(producto.cantidad * producto.precio_unitario).toFixed(2)}`, totalX, yPosition, { width: 90, align: 'right' });

        yPosition += 20;
      });

      // Precio total
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(textColor)
        .text(`Precio Total: $${pedido.precio_total.toFixed(2)}`, { align: 'right' })
        .moveDown();

      // Footer
      doc
        .rect(0, doc.page.height - 50, doc.page.width, 50)
        .fill(primaryColor)
        .fillColor('white')
        .fontSize(10)
        .text('Gracias por su compra', 30, doc.page.height - 40, { align: 'center', width: doc.page.width - 60 });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
