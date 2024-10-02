import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './index';
import { post } from './post';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').references((): AnyPgColumn => comment.id),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  content: text('content').notNull(),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const commentRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),

  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
}));
