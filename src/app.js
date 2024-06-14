import express from 'express';
import connectDB from './config.js';
import clienteRoutes from './routes/clientes.js';
import productoRoutes from './routes/productos.js';
import pedidoRoutes from './routes/pedidos.js'


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();




// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', clienteRoutes);
app.use('/api', productoRoutes);
app.use('/api', pedidoRoutes);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});