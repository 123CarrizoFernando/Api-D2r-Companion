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
          "+150 de Daño",
          "+110 de Maná",
          "Todas las Resistencias +50",
          "+150 de Defensa",
          "10% de Maná Robado por Impacto",
          "+150% de Daño a los Demonios",
          "50% de Posibilidad de Encontrar Objetos Mágicos"
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
          },
          {
            image_name: "aldurs_deception",
            name_es: "Engaño De Aldur",
            name_en: "Aldur's Deception",
            base_name: "Placa De Las Sombras",
            tier: "Élite",
            tc: "84",
            type: "Armaduras",
            defense: "746-857 (varia)",
            durability: "70",
            req_str: "115",
            req_lvl: "76",
            class_only: null,
            stats_blue: [
              "+1 a las Habilidades de Invocación (Solo druida)",
              "+1 a Habilidades de Cambio de Forma (Solo druida)",
              "+300 de Defensa",
              "+20 de Fuerza",
              "+15 de Destreza",
              "+40-50% de Resistencia a los Rayos (varia)",
              "Requisitos -50%"
            ],
            stats_green: [
              "+15 a la Vitalidad (2 Piezas)",
              "+30 a la Vitalidad (3 Piezas)",
              "+45 a la Vitalidad (Set Completo)"
            ],
            version: "Versión 1.09 y posteriores"
          },
          {
            image_name: "aldurs_rhythm",
            name_es: "Ritmo De Aldur",
            name_en: "Aldur's Rhythm",
            base_name: "Estrella Dentada",
            tier: "Excepcional",
            tc: "39",
            type: "Mazas",
            damage: "60 a 93",
            durability: "72",
            req_str: "74",
            req_lvl: "42",
            class_only: null,
            stats_blue: [
              "Velocidad de Ataque Aumentada un 30%",
              "+200% de Daño a los Demonios",
              "+50% de Daño a los Muertos Vivientes",
              "Añade 40-62 de Daño",
              "5% de Vida Robada por Impacto",
              "5% de Maná Robado por Impacto",
              "Engarces (2-3) (varia)"
            ],
            stats_green: [
              "+15 de Fuerza (2 Piezas)",
              "+30 de Fuerza (3 Piezas)",
              "+45 de Fuerza (Set Completo)"
            ],
            version: "Versión 1.09 y posteriores"
          },
          {
            image_name: "aldurs_advance",
            name_es: "Avance De Aldur",
            name_en: "Aldur's Advance",
            base_name: "Botas De Batalla",
            tier: "Excepcional",
            tc: "51",
            type: "Botas",
            defense: "39-47 (varia)",
            durability: "18",
            req_str: "95",
            req_lvl: "45",
            class_only: null,
            stats_blue: [
              "Correr/Andar un +40% Más Rápido",
              "+180 de Resistencia Máxima",
              "+50 a la Vida",
              "+40-50% de Resistencia al Fuego (varia)",
              "Un 10% del Daño Repercute en el Maná"
            ],
            stats_green: [
              "+15 de Destreza (2 Piezas)",
              "+30 de Destreza (3 Piezas)",
              "+45 de Destreza (Set Completo)"
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
    console.log('✅ Base de datos actualizada con el Set de Aldur COMPLETO (4 piezas).');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

seedSets();