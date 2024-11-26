import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";
import { createSchema } from "~/validations/todos/createSchema";
import { deleteSchema } from "~/validations/todos/deleteSchema";
import { editSchema } from "~/validations/todos/editSchema";
import { markAsCompletedSchema } from "~/validations/todos/markAsCompletedSchema";

export const todoRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.todos.findMany({
			orderBy: (todos, { desc }) => [desc(todos.createdAt)],
			where: eq(todos.isCompleted, false),
		});
	}),

	create: publicProcedure
		.input(createSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(todos).values({
				id: crypto.randomUUID(),
				title: input.title,
			});
		}),

	edit: publicProcedure.input(editSchema).mutation(async ({ ctx, input }) => {
		await ctx.db
			.update(todos)
			.set({
				title: input.title,
			})
			.where(eq(todos.id, input.id));
	}),

	markAsCompleted: publicProcedure
		.input(markAsCompletedSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(todos)
				.set({
					isCompleted: true,
				})
				.where(eq(todos.id, input.id));
		}),

	delete: publicProcedure
		.input(deleteSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(todos).where(eq(todos.id, input.id));
		}),
});
