const pool = require('./db');
const uniquesData = require('./uniques_lote10.json'); 

async function seedUniques() {
  console.log('Iniciando poblamiento de Objetos Únicos (Lote 10 - Final)...');
  try {
    for (const item of uniquesData) {
      await pool.query(
        `INSERT INTO unique_items (name, level_required, is_ethereal_possible, attributes) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO NOTHING`,
        [item.name, item.level_required, item.is_ethereal_possible, item.attributes]
      );
      console.log(`✔️ Procesado: ${item.name}`);
    }
    console.log('✅ Catálogo de Únicos completado exitosamente.');
  } catch (error) {
    console.error('❌ Error cargando los datos:', error.message);
  } finally {
    pool.end();
  }
}

seedUniques();