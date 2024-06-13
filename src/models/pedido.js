import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  pdfPath: {
    type: String
  }
});

export default mongoose.model('Pedido', PedidoSchema);

