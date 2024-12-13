import postgres from "postgres";

// postgres://username:password@host:port/database
const connection = process.env.DATABASE_URL || "";

export const sql = postgres(connection);

export function setupDB() {
  return sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}
