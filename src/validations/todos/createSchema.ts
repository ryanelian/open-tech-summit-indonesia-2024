import { z } from "zod";

export const createSchema = z.object({ title: z.string().min(1) });

export type CreateInput = z.infer<typeof createSchema>;
