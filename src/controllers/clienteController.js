import Cliente from '../models/Cliente.js';

export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).send(clienteGuardado);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).send(clientes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
