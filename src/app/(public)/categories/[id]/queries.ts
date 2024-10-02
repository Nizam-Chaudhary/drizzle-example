import { db } from '@/db';
import { post } from '@/db/schema';
import { executeQuery } from '@/db/utils/executeQuery';
import { wait } from '@/lib/utils';
import { count, desc, eq } from 'drizzle-orm';

export async function getCategoryPostsCount(categoryId: number) {
  return executeQuery({
    queryFn: async () =>
      db
        .select({ count: count() })
        .from(post)
        .where(eq(post.categoryId, categoryId))
        .then((res) => res[0].count),
    serverErrorMessage: 'getCategoryPostsCount',
    isProtected: false,
  });
}

export async function getPostsByCategoryId(
  page: number,
  limit: number,
  categoryId: number
) {
  return executeQuery({
    queryFn: async () =>
      await db.query.post.findMany({
        where: eq(post.categoryId, categoryId),
        columns: {
          id: true,
          title: true,
          shortDescription: true,
          updatedAt: true,
        },
        orderBy: desc(post.updatedAt),
        limit: limit,
        offset: page * limit,
      }),
    serverErrorMessage: 'getPostById',
    isProtected: false,
  });
}
