import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';

/** Bọc route handler: chuẩn hoá response lỗi { error: { code, message } } */
export function handle<T extends unknown[]>(fn: (...args: T) => Promise<Response>) {
  return async (...args: T): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json({ error: { code: 'VALIDATION', message: err.message } }, { status: 422 });
      }
      if (err instanceof AppError) {
        return NextResponse.json({ error: { code: err.code, message: err.message } }, { status: err.status });
      }
      console.error(err);
      return NextResponse.json({ error: { code: 'INTERNAL', message: 'Internal error' } }, { status: 500 });
    }
  };
}
