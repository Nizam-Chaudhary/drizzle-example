import { db } from '@/db';
import { post, user } from '@/db/schema';
import { executeQuery } from '@/db/utils/executeQuery';
import { wait } from '@/lib/utils';
import { count, desc, eq, ilike } from 'drizzle-orm';

export async function getCategories() {
  return executeQuery({
    queryFn: async () => await db.query.category.findMany(),
    isProtected: false,
    serverErrorMessage: 'getCategories',
  });
}

export async function getTags() {
  return executeQuery({
    queryFn: async () => await db.query.tag.findMany(),
    isProtected: false,
    serverErrorMessage: 'getTags',
  });
}

export async function getRelatedPostsByCategoryId(categoryId: number) {
  return executeQuery({
    queryFn: async () =>
      await db.query.post.findMany({
        limit: 4,
        where: eq(post.categoryId, categoryId),
        columns: {
          id: true,
          title: true,
          updatedAt: true,
          shortDescription: true,
        },
      }),
    isProtected: false,
    serverErrorMessage: 'getRelatedPostsByCategoryId',
  });
}

export async function getPostsCount(searchTerm?: string) {
  return executeQuery({
    queryFn: async () =>
      db
        .select({ count: count() })
        .from(post)
        .where(ilike(post.title, `%${searchTerm || ''}%`))
        .then((res) => res[0].count),
    isProtected: false,
    serverErrorMessage: 'getPostsCount',
  });
}

export async function getPosts(
  page: number,
  limit: number,
  searchTerm?: string
) {
  return executeQuery({
    queryFn: async () =>
      await db.query.post.findMany({
        limit: limit,
        offset: page * limit,
        where: ilike(post.title, `%${searchTerm || ''}%`),
        columns: {
          id: true,
          updatedAt: true,
          createdAt: true,
          userId: true,
          title: true,
          shortDescription: true,
          content: true,
          categoryId: true,
        },
        orderBy: desc(post.createdAt),
      }),
    isProtected: false,
    serverErrorMessage: 'getPosts',
  });
}

export async function getUserPostsCount(userId: number) {
  return executeQuery({
    queryFn: async () =>
      db
        .select({ count: count() })
        .from(post)
        .where(eq(post.userId, userId))
        .then((res) => res[0].count),
    isProtected: false,
    serverErrorMessage: 'getUserPostsCount',
  });
}

export async function getUserPosts({
  limit,
  page,
  userId,
}: {
  limit: number;
  page: number;
  userId: number;
}) {
  return executeQuery({
    queryFn: async () =>
      await db.query.post.findMany({
        limit: limit,
        offset: (page - 1) * limit,
        where: eq(post.userId, userId),
        columns: {
          id: true,
          updatedAt: true,
          createdAt: true,
          userId: true,
          title: true,
          shortDescription: true,
          content: true,
          categoryId: true,
        },
      }),
    isProtected: false,
    serverErrorMessage: 'getUserPosts',
  });
}

export async function getUser(userId: number) {
  return executeQuery({
    queryFn: async () =>
      await db
        .select({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        })
        .from(user)
        .where(eq(user.id, userId)),
    isProtected: false,
    serverErrorMessage: 'getTags',
  });
}
