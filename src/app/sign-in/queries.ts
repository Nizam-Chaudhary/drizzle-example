import { db } from '@/db';
import { user } from '@/db/schema/index';
import { userSchema } from '@/db/schema/user';
import { executeQuery } from '@/db/utils/executeQuery';
import { wait } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

export async function getUserByEmailAndPassword(data: unknown) {
  return executeQuery({
    queryFn: async () => {
      const validatedData = userSchema.parse(data);
      if (validatedData.mode === 'signIn') {
        return await db.query.user.findFirst({
          where: and(
            eq(user.email, validatedData.email),
            eq(user.password, validatedData.password)
          ),
        });
      }
    },
    isProtected: false,
    serverErrorMessage: 'getUserByEmailAndPassword',
  });
}
