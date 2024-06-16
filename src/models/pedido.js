import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  fecha_pedido: { type: Date, default: Date.now },
  estado: { type: String, required: true },
  productos: [{ nombre: String, cantidad: Number, precio_unitario: Number }],
  precio_total: { type: Number, required: true },
  pdfPath: {
    type: String
  }

});

export default mongoose.model('Pedido', PedidoSchema);

