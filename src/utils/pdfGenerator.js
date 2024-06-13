
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generatePDF = (pedido, pdfPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.text(`Pedido ID: ${pedido._id}`);
    doc.text(`Nombre: ${pedido.nombre}`);
    doc.text(`Email: ${pedido.email}`);
    doc.text(`Teléfono: ${pedido.telefono}`);
    doc.text(`Total: ${pedido.total}`);
    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};



