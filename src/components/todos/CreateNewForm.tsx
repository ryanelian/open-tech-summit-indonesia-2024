"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateInput,
	createSchema,
} from "~/validations/todos/createSchema";

export function CreateNewForm() {
	const { mutateAsync, isError, error, isPending, reset } =
		api.todo.create.useMutation();

	const utils = api.useUtils();

	const {
		handleSubmit,
		register,
		formState,
		reset: resetForm,
	} = useForm<CreateInput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			title: "",
		},
	});

	async function onSubmit(data: CreateInput) {
		reset();
		await mutateAsync({
			title: data.title,
		});
		resetForm({
			title: "",
		});
		reset();
		utils.todo.getAll.invalidate();
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col max-w-96 gap-1"
		>
			<input
				disabled={isPending}
				className="border border-neutral-600 p-2 py-1 disabled:opacity-60"
				placeholder="Title"
				{...register("title")}
			/>
			{isError ? (
				<div className="text-red-600 text-xs">
					{error.data?.zodError?.fieldErrors?.title}
				</div>
			) : formState.errors.title ? (
				<div className="text-red-600 text-xs">
					{formState.errors.title.message}
				</div>
			) : null}
			<button
				disabled={isPending}
				type="submit"
				className="bg-blue-500 rounded text-white py-2 disabled:opacity-60"
			>
				{isPending ? "Saving..." : "Save"}
			</button>
		</form>
	);
}
