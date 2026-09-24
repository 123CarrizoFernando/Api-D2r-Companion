const pool = require('./db');

async function seedSets() {
  console.log('Iniciando carga detallada de Sets V2...');
  try {
    await pool.query(`DROP TABLE IF EXISTS sets`);
    await pool.query(`
      CREATE TABLE sets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        class_restriction VARCHAR(50),
        partial_bonuses JSONB,
        full_bonuses JSONB,
        pieces JSONB
      )
    `);

    const setsData = [
      {
        name: "Aldur's Watchtower",
        class_restriction: "Druid",
        partial_bonuses: [
          "+150% de Daño a los Demonios (2 Piezas)",
          "50% de Posibilidad de Encontrar Objetos Mágicos (3 Piezas)"
        ],
        full_bonuses: [
          "+3 a las Habilidades del Druida",
          "+350% de Daño Mejorado",
          "+150 de Daño de Frío",
          "+110 de Maná",
          "Todas las Resistencias +50",
          "+150 de Defensa",
          "10% de Maná Robado por Impacto"
        ],
        pieces: [
          {
            image_name: "aldurs_stony_gaze",
            name_es: "Mirada De Piedra De Aldur",
            name_en: "Aldur's Stony Gaze",
            base_name: "El Disfraz Cazador",
            tier: "Excepcional",
            tc: "48",
            type: "Yelmos",
            defense: "157-171 (varia)",
            durability: "20",
            req_str: "56",
            req_lvl: "36",
            class_only: "Solo druida",
            stats_blue: [
              "Recuperación de Golpe un +25% Más Rápida",
              "+90 de Defensa",
              "17% de Regeneración de Maná",
              "+40-50% de Resistencia al Frío (varia)",
              "+5 de Radio de Visión",
              "Engarces (2)"
            ],
            stats_green: [
              "+15 de Energía (2 Piezas)",
              "+30 de Energía (3 Piezas)",
              "+45 de Energía (Set Completo)"
            ],
            version: "Versión 1.09 y posteriores"
          }
        ]
      }
    ];

    for (const set of setsData) {
      await pool.query(
        `INSERT INTO sets (name, class_restriction, partial_bonuses, full_bonuses, pieces) VALUES ($1, $2, $3, $4, $5)`,
        [set.name, set.class_restriction, JSON.stringify(set.partial_bonuses), JSON.stringify(set.full_bonuses), JSON.stringify(set.pieces)]
      );
    }
    console.log('✅ Base de datos actualizada con formato fiel al juego.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

seedSets();