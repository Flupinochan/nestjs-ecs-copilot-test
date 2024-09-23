import { User } from '@prisma/client';

// Requestオブジェクトを拡張し、userプロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
