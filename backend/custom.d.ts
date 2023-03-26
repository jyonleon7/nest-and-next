import { User } from '@prisma/client';

// express の 「Request」に、user をつける
declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>;
  }
}
