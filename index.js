const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite que Flutter se conecte sin problemas de políticas de seguridad
app.use(express.json()); // Permite recibir datos en formato JSON

// ==========================================
// RUTAS DE LA API
// ==========================================

// Endpoint: GET /api/runes
app.get('/api/runes', async (req, res) => {
  try {
    // Pedimos las runas a Neon, ordenadas por nivel requerido
    const result = await pool.query('SELECT * FROM runes ORDER BY level_required ASC');
    
    // Devolvemos el resultado a Flutter en formato JSON
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor al consultar Neon.' });
  }
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`🔥 D2R API corriendo en http://localhost:${port}`);
});