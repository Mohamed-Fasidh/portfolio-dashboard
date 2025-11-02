import { z } from 'zod';

export const holdingSchema = z.object({
  symbol: z.string().min(1),
  exchange: z.string().min(1),
  name: z.string().min(1),
  sector: z.string().min(1),
  purchasePrice: z.number().nonnegative(),
  qty: z.number().int().positive(),
});

export const holdingsSchema = z.array(holdingSchema).min(1);
