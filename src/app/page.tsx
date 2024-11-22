"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
	return (
		<div className="flex flex-col gap-8 p-16 items-center">
			<h1 className="text-4xl">To-Do List</h1>
			<CreateNewForm />
			<ToDoList />
		</div>
	);
}

function ToDoList() {
	const { data, isLoading, isLoadingError } = api.todo.getAll.useQuery();

	if (!data || isLoading) {
		return <div>Loading...</div>;
	}
	
	if (isLoadingError) {
		return <div>Error loading todos</div>;
	}

	if (data.length === 0) {
		return <div>No todos</div>;
	}

	return (
		<>
			{data.map((api) => (
				<div key={api.id}>{api.title}</div>
			))}
		</>
	);
}

function CreateNewForm() {
	const [title, setTitle] = useState("");

	const { mutateAsync, isError, error, isPending, reset } =
		api.todo.create.useMutation();

	const utils = api.useUtils();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		reset();
		await mutateAsync({ title });

		setTitle("");
		reset();
		utils.todo.getAll.invalidate();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col max-w-96 gap-1">
			<input
				disabled={isPending}
				className="border border-neutral-600 p-2 py-1 disabled:opacity-60"
				name="title"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			{isError && (
				<div className="text-red-600 text-xs">
					{error.data?.zodError?.fieldErrors?.title}
				</div>
			)}
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

// SSR Mode
// 'use server';

// import { HydrateClient, api } from "~/trpc/server";
// export default function Home() {
// 	// await api.todo.getAll.prefetch();

// 	return (
// 		// <HydrateClient>
// 		// 		<TodoList />
// 		// </HydrateClient>
// 		<TodoList />
// 	);
// }
