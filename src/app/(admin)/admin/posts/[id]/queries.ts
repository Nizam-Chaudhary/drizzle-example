import { db } from '@/db';
import { post } from '@/db/schema';
import { executeQuery } from '@/db/utils/executeQuery';
import { wait } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export async function getPostById(id: number) {
  return executeQuery({
    queryFn: async () =>
      await db.query.post.findFirst({
        where: eq(post.id, id),
        columns: {
          id: true,
          title: true,
          shortDescription: true,
          categoryId: true,
          userId: true,
          content: true,
        },
        with: {
          tags: true,
        },
      }),
    serverErrorMessage: 'getPostById',
    isProtected: true,
  });
}
