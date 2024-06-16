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

      const doc = new PDFDocument({ margin: 30 });
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      // Información del negocio
      const businessName = 'Nombre del Negocio';
      const businessAddress = 'Dirección del Negocio';
      const businessPhone = 'Teléfono del Negocio';
      const businessEmail = 'Email del Negocio';

      // Colores
      const headerColor = '#4CAF50';
      const tableHeaderColor = '#D3D3D3';
      const tableRowColor = '#F9F9F9';
      const tableRowAltColor = '#FFFFFF';

      // Agregar encabezado del negocio
      doc
        .fontSize(14)
        .fillColor(headerColor)
        .text(businessName, { align: 'right' })
        .fontSize(10)
        .fillColor('black')
        .text(businessAddress, { align: 'right' })
        .text(businessPhone, { align: 'right' })
        .text(businessEmail, { align: 'right' })
        .moveDown(1.5);

      // Agregar encabezado de la orden de pago
      doc
        .fontSize(20)
        .fillColor(headerColor)
        .text('Orden de Pago', { align: 'center' })
        .moveDown();

      // Información del cliente
      doc
        .fillColor('black')
        .fontSize(12)
        .text(`Pedido ID: ${pedido._id}`)
        .text(`Nombre: ${cliente.nombre}`)
        .text(`Email: ${cliente.email}`)
        .text(`Teléfono: ${cliente.telefono}`)
        .text(`Fecha de Pedido: ${new Date(pedido.fecha_pedido).toLocaleDateString()}`)
        .text(`Estado: ${pedido.estado}`)
        .moveDown();

      // Tabla de productos
      doc
        .fontSize(12)
        .text('Productos:', { underline: true })
        .moveDown(0.5);

      const tableTop = doc.y;
      const itemCodeX = 50;
      const descriptionX = 150;
      const quantityX = 300;
      const priceX = 350;
      const totalX = 450;

      // Encabezados de la tabla
      doc
        .fillColor(tableHeaderColor)
        .rect(itemCodeX - 5, tableTop - 2, totalX + 50, 20)
        .fill()
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Producto', itemCodeX, tableTop)
        .text('Cantidad', quantityX, tableTop)
        .text('Precio Unitario', priceX, tableTop)
        .text('Total', totalX, tableTop);

      doc.moveDown();

      // Productos
      let yPosition = tableTop + 20;
      let isAltRow = false;
      pedido.productos.forEach(producto => {
        const rowColor = isAltRow ? tableRowAltColor : tableRowColor;
        doc
          .fillColor(rowColor)
          .rect(itemCodeX - 5, yPosition - 2, totalX + 50, 20)
          .fill()
          .fillColor('black')
          .font('Helvetica')
          .fontSize(10)
          .text(producto.nombre, itemCodeX, yPosition)
          .text(producto.cantidad, quantityX, yPosition, { width: 90, align: 'center' })
          .text(`$${producto.precio_unitario.toFixed(2)}`, priceX, yPosition, { width: 90, align: 'right' })
          .text(`$${(producto.cantidad * producto.precio_unitario).toFixed(2)}`, totalX, yPosition, { width: 90, align: 'right' });

        yPosition += 20;
        isAltRow = !isAltRow;
      });

      // Precio total
      yPosition += 10;
      doc
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(`Precio Total: $${pedido.precio_total.toFixed(2)}`, totalX, yPosition, { width: 90, align: 'right' });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
