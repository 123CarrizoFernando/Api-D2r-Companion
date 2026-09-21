const pool = require('./db');
const basesData = require('./bases.json');

async function seedBases() {
  console.log('Iniciando poblamiento de bases...');
  try {
    for (const item of basesData) {
      await pool.query(
        `INSERT INTO base_items (name, category, max_sockets, strength_required, dexterity_required, is_elite) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [item.name, item.category, item.max_sockets, item.strength_required, item.dexterity_required, item.is_elite]
      );
      console.log(`✔️ Insertado: ${item.name}`);
    }
    console.log('✅ Todas las bases fueron cargadas exitosamente.');
  } catch (error) {
    console.error('❌ Error cargando los datos:', error.message);
  } finally {
    pool.end(); // Cierra la conexión para que la terminal no se quede colgada
  }
}

seedBases();