import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

const sqlite = new Database('sqlite.db')

export const table_users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  email: text('email'),
  password_hash: text('password_hash'),
})
export const magicLinks = sqliteTable("magic_links", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
  });
  
export const table_sessions = sqliteTable('sessions', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => table_users.id),
  expiresAt: integer('expires_at').notNull(),
})

export const db = drizzle(sqlite)