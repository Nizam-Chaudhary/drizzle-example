import { auth } from '@/lib/auth';

type Options<T> = {
  queryFn: {
    (): Promise<T>;
  };
  isProtected?: boolean;
  serverErrorMessage?: string;
};

export async function executeQuery<T>({
  queryFn,
  isProtected = true,
  serverErrorMessage = 'Error executing query',
}: Options<T>) {
  try {
    if (isProtected) {
      const session = await auth();
      if (!session) throw new Error('Not Authorized');
    }

    return await queryFn();
  } catch (e) {
    console.error(serverErrorMessage, e);
    return null;
  }
}
