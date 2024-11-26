import { z } from "zod";

export const editSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1),
});
