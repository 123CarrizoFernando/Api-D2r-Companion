const pool = require('./db');

async function seedMercenaries() {
  console.log('Iniciando carga de Mercenarios...');
  try {
    // 1. Insertar Mercenarios Base (Acto 2 son los más usados)
    const merc1Res = await pool.query(
      `INSERT INTO mercenaries (act, aura_or_skill, type) VALUES ($1, $2, $3) RETURNING id`,
      [2, 'Holy Freeze', 'Desert Mercenary']
    );
    const merc2Res = await pool.query(
      `INSERT INTO mercenaries (act, aura_or_skill, type) VALUES ($1, $2, $3) RETURNING id`,
      [2, 'Might', 'Desert Mercenary']
    );
    const holyFreezeId = merc1Res.rows[0].id;
    
    // 2. Obtener los IDs de las builds existentes
    const builds = await pool.query(`SELECT id, name FROM builds`);
    
    for (const build of builds.rows) {
      if (build.name === 'Blizzard Sorceress') {
        await pool.query(
          `INSERT INTO build_mercenaries (build_id, mercenary_id, setup_name, weapon_runeword_name, helm_unique_name, armor_runeword_name, justification) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [build.id, holyFreezeId, 'Standard Insight setup', 'Insight', 'Andariel\'s Visage', 'Treachery', 'Holy Freeze ralentiza a los enemigos para mantener a la Sorceress segura. Insight provee maná infinito.']
        );
      } else if (build.name === 'Blessed Hammer (Hammerdin)') {
        await pool.query(
          `INSERT INTO build_mercenaries (build_id, mercenary_id, setup_name, weapon_runeword_name, helm_unique_name, armor_runeword_name, justification) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [build.id, holyFreezeId, 'Standard Insight setup', 'Insight', 'Andariel\'s Visage', 'Treachery', 'Holy Freeze ayuda con el control de masas ya que los martillos requieren posicionamiento cercano. Insight soluciona el gasto de maná.']
        );
      }
    }
    console.log('✅ Mercenarios asignados a las builds exitosamente.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

seedMercenaries();