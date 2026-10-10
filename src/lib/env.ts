import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().url(),
  FE_ORIGIN: z.string().url(),
  OPEN_METEO_BASE_URL: z.string().url(),
  CRON_SECRET: z.string().min(8),
});

export const env = schema.parse(process.env);
