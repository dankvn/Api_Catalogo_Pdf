import cliente from '../models/cliente.js';

export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).send(clienteGuardado);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await cliente.find();
    res.status(200).send(clientes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
