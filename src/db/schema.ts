import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  anonId: text('anon_id').notNull().unique(),
  createdAt: integer('created_at').notNull(),
  lastSeenAt: integer('last_seen_at').notNull(),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  timestamp: integer('timestamp').notNull(),
}, (table) => ({
  sessionTsIdx: index('session_ts_idx').on(table.sessionId, table.timestamp),
}));

export const moodLogs = sqliteTable('mood_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  mood: text('mood').notNull(),
  note: text('note').notNull().default(''),
  ts: integer('ts').notNull(),
}, (table) => ({
  moodSessionTsIdx: index('mood_session_ts_idx').on(table.sessionId, table.ts),
}));


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});