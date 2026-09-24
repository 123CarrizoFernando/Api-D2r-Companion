const pool = require('./db');

async function seedSets() {
  console.log('Iniciando carga detallada de Sets...');
  try {
    // 1. Borrar tabla vieja y crear la nueva con soporte JSON avanzado
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

    // 2. Datos de los Sets (Aquí agregas todos los detalles minuciosos)
    const setsData = [
      {
        name: "Tal Rasha's Wrappings",
        class_restriction: "Sorceress",
        partial_bonuses: [
          "Replenish Life +10 (2 Items)",
          "65% Better Chance Of Getting Magic Items (3 Items)",
          "25% Faster Hit Recovery (4 Items)"
        ],
        full_bonuses: [
          "+3 To Sorceress Skill Levels",
          "Replenish Life +10",
          "65% Better Chance Of Getting Magic Items",
          "25% Faster Hit Recovery",
          "+150 To Life",
          "All Resistances +50",
          "+50 Defense Vs. Missile",
          "+150 Defense"
        ],
        pieces: [
          {
            name: "Tal Rasha's Lidless Eye",
            base_type: "Swirling Crystal",
            damage: "18 to 42",
            durability: 50,
            req_lvl: 65,
            is_ethereal: false,
            stats: [
              "20% Faster Cast Rate",
              "+77 To Mana",
              "+57 To Life",
              "+10 To Energy",
              "+1-2 To Lightning Mastery (Sorceress Only)",
              "+1-2 To Fire Mastery (Sorceress Only)",
              "+1-2 To Cold Mastery (Sorceress Only)"
            ]
          },
          {
            name: "Tal Rasha's Guardianship",
            base_type: "Lacquered Plate",
            defense: "833 to 941",
            durability: 55,
            req_str: 84,
            req_lvl: 71,
            is_ethereal: false,
            stats: [
              "+400 Defense",
              "Requirements -60%",
              "Magic Damage Reduced By 15",
              "Cold Resist +40%",
              "Lightning Resist +40%",
              "Fire Resist +40%",
              "88% Better Chance Of Getting Magic Items"
            ]
          },
          {
            name: "Tal Rasha's Adjudication",
            base_type: "Amulet",
            req_lvl: 67,
            stats: [
              "+2 To Sorceress Skill Levels",
              "Lightning Resist +33%",
              "+42 To Mana",
              "+50 To Life"
            ]
          }
        ]
      },
      {
        name: "Immortal King",
        class_restriction: "Barbarian",
        partial_bonuses: [
          "+50 To Attack Rating (2 Items)",
          "+75 To Attack Rating (3 Items)",
          "+125 To Attack Rating (4 Items)",
          "+200 To Attack Rating (5 Items)"
        ],
        full_bonuses: [
          "+3 To Barbarian Skill Levels",
          "+450 To Attack Rating",
          "+150 To Life",
          "All Resistances +50",
          "Magic Damage Reduced By 10"
        ],
        pieces: [
          {
            name: "Immortal King's Stone Crusher",
            base_type: "Ogre Maul",
            damage: "231 to 318",
            durability: 60,
            req_str: 225,
            req_lvl: 76,
            is_ethereal: false,
            stats: [
              "+200% Enhanced Damage",
              "+200% Damage To Demons",
              "+250% Damage To Undead",
              "40% Increased Attack Speed",
              "Indestructible",
              "35-40% Chance Of Crushing Blow",
              "Sockets (2)"
            ]
          }
        ]
      }
    ];

    // 3. Insertar en la base de datos
    for (const set of setsData) {
      await pool.query(
        `INSERT INTO sets (name, class_restriction, partial_bonuses, full_bonuses, pieces) VALUES ($1, $2, $3, $4, $5)`,
        [set.name, set.class_restriction, JSON.stringify(set.partial_bonuses), JSON.stringify(set.full_bonuses), JSON.stringify(set.pieces)]
      );
    }
    console.log('✅ Sets detallados cargados exitosamente.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

seedSets();