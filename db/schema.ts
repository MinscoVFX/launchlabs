import { pgTable, text, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";

export const tokenMetadata = pgTable("token_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  image: text("image"),
  mintAddress: text("mint_address"),
  poolId: text("pool_id"),
  creatorWallet: text("creator_wallet"),
  telegram: text("telegram"),
  website: text("website"),
  twitter: text("twitter"),
  discord: text("discord"),
  supply: text("supply"),
  decimals: integer("decimals").default(6),
  solToRaise: text("sol_to_raise"),
  migrateType: text("migrate_type"),
  metadataJson: jsonb("metadata_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  launchedAt: timestamp("launched_at"),
});
