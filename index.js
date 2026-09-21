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

// Endpoint: GET /api/runewords
app.get('/api/runewords', async (req, res) => {
  try {
    // Usamos json_agg para agrupar las runas hijas en un array dentro de la respuesta padre,
    // respetando estrictamente el orden (rune_order)
    const query = `
      SELECT 
        rw.id, rw.name, rw.level_required, rw.sockets_required, rw.attributes,
        json_agg(
          json_build_object(
            'id', r.id, 
            'name', r.name, 
            'level_required', r.level_required
          ) ORDER BY rr.rune_order
        ) as runes
      FROM runewords rw
      JOIN runeword_runes rr ON rw.id = rr.runeword_id
      JOIN runes r ON rr.rune_id = r.id
      GROUP BY rw.id
      ORDER BY rw.level_required ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno al consultar las palabras rúnicas.' });
  }
});

// Endpoint: GET /api/items/uniques
app.get('/api/items/uniques', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.level_required, 
        u.is_ethereal_possible, 
        u.attributes,
        i.name AS base_type
      FROM unique_items u
      LEFT JOIN item_types i ON u.item_type_id = i.id
      ORDER BY u.level_required ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno al consultar los objetos únicos.' });
  }
});


// Levantar el servidor
app.listen(port, () => {
  console.log(`🔥 D2R API corriendo en http://localhost:${port}`);
});