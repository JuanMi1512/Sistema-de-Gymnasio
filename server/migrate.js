import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const database = process.env.DB_NAME || 'blue_fit';
const migrationNames = [
  '001_initial.sql',
  '002_memberships_access.sql',
  '003_membership_lifecycle.sql',
  '004_operations.sql',
  '005_trainers.sql',
  '007_seed_members.sql',
  '008_commerce_training.sql',
  '009_seed_plans.sql',
];
const migrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'database', 'mysql');

const connectionOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function executeSqlFile(connection, sql) {
  // La conexión ya está seleccionando la base de datos. Ejecutar las sentencias
  // separadas evita incompatibilidades de algunos MySQL locales con USE + SQL.
  const statements = sql
    .replace(/^\s*USE\s+`?blue_fit`?\s*;\s*/gim, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) await connection.query(statement);
}

export async function migrate() {
  const connection = await mysql.createConnection(connectionOptions);
  try {
    // La primera migración crea la base de datos; luego se guarda el historial en ella.
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, '``')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.changeUser({ database });
    await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(190) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    const [applied] = await connection.query('SELECT name FROM schema_migrations');
    const appliedNames = new Set(applied.map(({ name }) => name));

    for (const name of migrationNames) {
      if (appliedNames.has(name)) continue;
      const sql = await readFile(join(migrationsDirectory, name), 'utf8');
      await executeSqlFile(connection, sql);
      await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [name]);
      console.log(`Migración aplicada: ${name}`);
    }
  } finally {
    await connection.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate().catch((error) => {
    console.error('No se pudieron aplicar las migraciones:', error.message);
    process.exitCode = 1;
  });
}
