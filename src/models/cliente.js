import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
