import { category, user } from '@/db/schema/index';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { comment } from './comment';
import { postTags } from './postTags';

export const post = pgTable('post', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  title: varchar('title', { length: 255 }).notNull(),
  shortDescription: text('short_description'),
  content: text('content').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => category.id),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const postRelations = relations(post, ({ one, many }) => ({
  tags: many(postTags),
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [post.categoryId],
    references: [category.id],
  }),
  comments: many(comment),
}));
