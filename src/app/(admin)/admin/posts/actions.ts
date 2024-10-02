'use server';

import { db } from '@/db';
import { post, postTags } from '@/db/schema';
import { executeAction } from '@/db/utils/executeAction';
import { eq } from 'drizzle-orm';

export async function deletePostById(id: number) {
  return executeAction({
    actionFn: async () =>
      await db.transaction(async (tx) => {
        await tx.delete(postTags).where(eq(postTags.postId, id));
        await tx.delete(post).where(eq(post.id, id));
      }),
    isProtected: true,
    clientSuccessMessage: 'Post deleted successfully',
    serverErrorMessage: 'deletePostById',
  });
}
