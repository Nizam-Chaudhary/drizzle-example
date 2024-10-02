import { faker } from '@faker-js/faker';
import { DB } from '..';
import { user, UserSchema } from '../schema/user';

const mock = () => {
  const data: Omit<Extract<UserSchema, { mode: 'signUp' }>, 'mode'>[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ memorable: true, length: 4 }),
      age: faker.number.int({ min: 18, max: 99 }),
    });
  }

  return data;
};

export async function seed(db: DB) {
  await db.insert(user).values(mock());
}
