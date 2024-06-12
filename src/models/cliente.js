import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: {
    calle: String,
    ciudad: String,
    estado: String,
    codigo_postal: String,
    pais: String
  }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
