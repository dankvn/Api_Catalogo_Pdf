import express from 'express';
import axios from 'axios';

const router = express.Router();
const strapiApiUrl = 'http://localhost:1337/api/productos'; // Cambia esto si tu Strapi no está en localhost
const strapiToken = process.env.STRAPI_TOKEN; // Reemplaza con tu token de autenticación

// Endpoint para recibir datos de Strapi
router.post('/webhook/strapi', async (req, res) => {
  try {
    const { data } = req.body;

    // Verifica el tipo de evento (creación, actualización, eliminación)
    if (data.event === 'entry.create') {
      // Crear producto en tu API
      await axios.post(strapiApiUrl, { data }, {
        headers: { Authorization: `Bearer ${strapiToken}` },
      });
    } else if (data.event === 'entry.update') {
      // Actualizar producto en tu API
      await axios.put(`${strapiApiUrl}/${data.id}`, { data }, {
        headers: { Authorization: `Bearer ${strapiToken}` },
      });
    } else if (data.event === 'entry.delete') {
      // Eliminar producto en tu API
      await axios.delete(`${strapiApiUrl}/${data.id}`, {
        headers: { Authorization: `Bearer ${strapiToken}` },
      });
    }

    res.status(200).send('Webhook recibido');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
