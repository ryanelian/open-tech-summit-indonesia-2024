import { z } from "zod";

export const markAsCompletedSchema = z.object({ id: z.string().uuid() });
