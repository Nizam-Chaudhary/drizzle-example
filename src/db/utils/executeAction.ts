import { auth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/utils';
import { isRedirectError } from 'next/dist/client/components/redirect';

type Options<T> = {
  actionFn: {
    (): Promise<T>;
  };
  isProtected?: boolean;
  serverErrorMessage?: string;
  clientSuccessMessage?: string;
};

export async function executeAction<T>({
  actionFn,
  isProtected = true,
  serverErrorMessage = 'Error executing action',
  clientSuccessMessage = 'Operation was successful',
}: Options<T>): Promise<{ success: boolean; message: string }> {
  try {
    if (isProtected) {
      const session = await auth();
      if (!session) throw new Error('Not Authorized');
    }

    await actionFn();
    return {
      success: true,
      message: clientSuccessMessage,
    };
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    console.error(serverErrorMessage, e);
    return {
      success: false,
      message: getErrorMessage(e),
    };
  }
}
