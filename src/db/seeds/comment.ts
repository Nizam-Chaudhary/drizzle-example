import { faker } from '@faker-js/faker';
import { DB, db } from '..';
import { comment, CommentSchema } from '../schema/comment';

const parentCommentsMock = async () => {
  const [postsData, usersData] = await Promise.all([
    db.query.post.findMany(),
    db.query.user.findMany(),
  ]);

  const randomPosts = faker.helpers.arrayElements(postsData);
  const data: CommentSchema[] = randomPosts.map((post) => ({
    postId: post.id,
    content: faker.lorem.sentences(),
    userId: faker.helpers.arrayElement(usersData).id,
  }));

  return data;
};

const childCommentsMock = async () => {
  const [commentsData, usersData] = await Promise.all([
    db.query.comment.findMany(),
    db.query.user.findMany(),
  ]);

  const randomComments = faker.helpers.arrayElements(commentsData);

  const data: CommentSchema[] = randomComments.map((comment) => ({
    postId: comment.postId,
    content: faker.lorem.sentences(),
    userId: faker.helpers.arrayElement(usersData).id,
    parentId: comment.id,
  }));

  return data;
};

export async function seed(db: DB) {
  const parentCommentsInsertData = await parentCommentsMock();
  await db.insert(comment).values(parentCommentsInsertData);

  const childCommentsInsertData = await childCommentsMock();
  await db.insert(comment).values(childCommentsInsertData);
}
