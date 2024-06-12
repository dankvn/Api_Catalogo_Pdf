import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  fecha_pedido: { type: Date, default: Date.now },
  estado: { type: String, default: 'pendiente' },
  total: { type: Number, required: true },
  productos: [
    {
      producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
      precio_unitario: { type: Number, required: true }
    }
  ]
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;

