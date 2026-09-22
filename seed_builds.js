const pool = require('./db');
const buildsData = require('./builds_starter.json');

async function seedBuilds() {
  console.log('Iniciando poblamiento de Builds...');
  try {
    for (const build of buildsData) {
      // 1. Insertar la build principal
      const buildRes = await pool.query(
        `INSERT INTO builds (character_class, name, tier, budget_level, description) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [build.character_class, build.name, build.tier, build.budget_level, build.description]
      );
      
      const buildId = buildRes.rows[0].id;
      console.log(`✔️ Build creada: ${build.name}`);

      // 2. Insertar su equipamiento
      for (const item of build.equipment) {
        await pool.query(
          `INSERT INTO build_equipment (build_id, slot, unique_item_name, runeword_name, is_alternative) 
           VALUES ($1, $2, $3, $4, $5)`,
          [buildId, item.slot, item.unique_item_name, item.runeword_name, item.is_alternative]
        );
      }
    }
    console.log('✅ Builds cargadas exitosamente.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

seedBuilds();