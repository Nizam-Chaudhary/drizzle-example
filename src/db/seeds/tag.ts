import { faker } from '@faker-js/faker';
import { DB } from '..';
import { tag, TagSchema } from '../schema/tag';

const mock = () => {
  const data: TagSchema[] = [];

  for (let i = 0; i < 10; i++) {
    data.push({
      name: faker.lorem.word({ length: 15 }),
    });
  }

  return data;
};

export async function seed(db: DB) {
  await db.insert(tag).values(mock());
}
