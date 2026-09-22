const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// ==========================================
// RUTAS DE LA API
// ==========================================

// 1. RUNAS
app.get('/api/runes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM runes ORDER BY level_required ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno al consultar las runas.' });
  }
});

// 2. PALABRAS RÚNICAS
app.get('/api/runewords', async (req, res) => {
  try {
    const query = `
      SELECT 
        rw.id, rw.name, rw.level_required, rw.sockets_required, rw.attributes,
        json_agg(
          json_build_object('id', r.id, 'name', r.name, 'level_required', r.level_required) ORDER BY rr.rune_order
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

// 3. OBJETOS ÚNICOS
app.get('/api/items/uniques', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.level_required, u.is_ethereal_possible, u.attributes, i.name AS base_type
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

// 4. BUILDS Y MERCENARIOS (CRUCE COMPLETO)
app.get('/api/builds', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id, b.character_class, b.name, b.tier, b.budget_level, b.description,
        (
          SELECT json_agg(
            json_build_object(
              'slot', be.slot, 
              'is_alternative', be.is_alternative, 
              'unique_item_name', be.unique_item_name, 
              'runeword_name', be.runeword_name,
              'unique_attributes', ui.attributes,
              'runeword_attributes', rw.attributes
            )
          )
          FROM build_equipment be 
          LEFT JOIN unique_items ui ON be.unique_item_name = ui.name
          LEFT JOIN runewords rw ON be.runeword_name = rw.name
          WHERE be.build_id = b.id
        ) as equipment,
        (
          SELECT json_build_object(
            'act', m.act,
            'aura', m.aura_or_skill,
            'type', m.type,
            'weapon', bm.weapon_runeword_name,
            'helm', bm.helm_unique_name,
            'armor', bm.armor_runeword_name,
            'justification', bm.justification
          )
          FROM build_mercenaries bm
          JOIN mercenaries m ON bm.mercenary_id = m.id
          WHERE bm.build_id = b.id
          LIMIT 1
        ) as mercenary
      FROM builds b
      ORDER BY b.character_class, b.name;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno al consultar las builds.' });
  }
});

// 5. BASES PARA RUNEWORDS
app.get('/api/bases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM base_items ORDER BY category, max_sockets DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al consultar las bases.' });
  }
});

// 6. SETS
app.get('/api/sets', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, s.name, s.partial_bonuses, s.full_bonuses,
        json_agg(
          json_build_object('name', sp.name, 'base', sp.base_type, 'stats', sp.attributes)
        ) as pieces
      FROM item_sets s
      JOIN set_pieces sp ON s.id = sp.set_id
      GROUP BY s.id
      ORDER BY s.name;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al consultar los sets.' });
  }
});

// 7. ENCICLOPEDIA DE MERCENARIOS
app.get('/api/mercenaries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mercenaries ORDER BY act, type');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al consultar los mercenarios.' });
  }
});

app.listen(port, () => {
  console.log(`🔥 D2R API corriendo en http://localhost:${port}`);
});