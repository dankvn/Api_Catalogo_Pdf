const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  pedido_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' },
  fecha_factura: { type: Date, default: Date.now },
  monto_total: Number,
  detalles_pago: {
    metodo_pago: String,
    estado_pago: String,
    fecha_pago: Date
  }
});

const Factura = mongoose.model('Factura', facturaSchema);
module.exports = Factura;