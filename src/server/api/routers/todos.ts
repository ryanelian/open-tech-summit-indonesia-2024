import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.todos.findMany({
			orderBy: (todos, { desc }) => [desc(todos.createdAt)],
			where: eq(todos.isCompleted, false),
		});
	}),

	create: publicProcedure
		.input(z.object({ title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(todos).values({
				id: crypto.randomUUID(),
				title: input.title,
			});
		}),

	edit: publicProcedure
		.input(z.object({ id: z.string().uuid(), title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(todos)
				.set({
					title: input.title,
				})
				.where(eq(todos.id, input.id));
		}),

	markAsCompleted: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(todos)
				.set({
					isCompleted: true,
				})
				.where(eq(todos.id, input.id));
		}),

	delete: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(todos).where(eq(todos.id, input.id));
		}),
});
