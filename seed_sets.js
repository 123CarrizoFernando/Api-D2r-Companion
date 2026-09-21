const pool = require('./db');
const setsData = require('./sets_completo.json');

async function seedSets() {
  console.log('Iniciando poblamiento masivo de Sets...');
  try {
    for (const set of setsData) {
      // Insertamos el set padre y obtenemos su ID
      const setQuery = `
        INSERT INTO item_sets (name, partial_bonuses, full_bonuses) 
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        RETURNING id;
      `;
      const resSet = await pool.query(setQuery, [set.name, set.partial_bonuses, set.full_bonuses]);
      
      let setId;
      if (resSet.rows.length > 0) {
        setId = resSet.rows[0].id;
        console.log(`✔️ Creado Set: ${set.name}`);
      } else {
        // Si ya existía, buscamos su ID
        const existing = await pool.query('SELECT id FROM item_sets WHERE name = $1', [set.name]);
        setId = existing.rows[0].id;
        console.log(`ℹ️ El set ya existía: ${set.name}`);
      }

      // Insertamos las piezas hijas vinculadas
      for (const piece of set.pieces) {
        await pool.query(
          `INSERT INTO set_pieces (set_id, name, base_type, level_required, attributes) 
           VALUES ($1, $2, $3, $4, $5)`,
          [setId, piece.name, piece.base_type, piece.level_required, piece.attributes]
        );
        console.log(`    ↳ Pieza agregada: ${piece.name}`);
      }
    }
    console.log('✅ Catálogo de Sets procesado exitosamente.');
  } catch (error) {
    console.error('❌ Error cargando los sets:', error.message);
  } finally {
    pool.end();
  }
}

seedSets();