import * as schema from '@/db/schema';
import * as seeds from '@/db/seeds';
import { sql, Table } from 'drizzle-orm';
import { db, DB } from '.';

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
  for (const table of [
    schema.category,
    schema.comment,
    schema.post,
    schema.postTags,
    schema.tag,
    schema.user,
  ]) {
    await resetTable(db, table);
  }

  await seeds.category(db);
  await seeds.user(db);
  await seeds.tag(db);
  await seeds.post(db);
  await seeds.postTags(db);
  await seeds.comment(db);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log('seeding done!!!');
    process.exit(0);
  });
