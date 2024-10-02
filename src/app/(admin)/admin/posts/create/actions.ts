'use server';

import { db } from '@/db';
import { postTags } from '@/db/schema';
import { post, postSchema, PostSchema } from '@/db/schema/post';
import { executeAction } from '@/db/utils/executeAction';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPost(data: PostSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = postSchema.parse(data);

      const { postId } = (
        await db
          .insert(post)
          .values(validatedData)
          .returning({ postId: post.id })
      )[0];

      if (validatedData.tagIds.length > 0) {
        await db.insert(postTags).values(
          validatedData.tagIds.map((tagId) => ({
            postId,
            tagId,
          }))
        );
      }
      revalidatePath('/admin/posts');
    },
    isProtected: true,
    clientSuccessMessage: 'Post created successfully',
    serverErrorMessage: 'createPost',
  });
}

export async function updatePost(data: PostSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = postSchema.parse(data);

      if (validatedData.mode === 'edit') {
        const { postId } = (
          await db
            .update(post)
            .set(validatedData)
            .where(eq(post.id, +validatedData.id))
            .returning({ postId: post.id })
        )[0];

        await db.delete(postTags).where(eq(postTags.postId, +validatedData.id));

        if (validatedData.tagIds.length > 0) {
          await db.insert(postTags).values(
            validatedData.tagIds.map((tagId) => ({
              postId: validatedData.id!,
              tagId,
            }))
          );
        }
        revalidatePath('/admin/posts');
      }
    },
    isProtected: true,
    clientSuccessMessage: 'Post updated successfully',
    serverErrorMessage: 'updatePost',
  });
}
