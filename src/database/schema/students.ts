// docs: https://orm.drizzle.team/docs/sql-schema-declaration
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("students", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  studentNumber: text("student_number").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});
