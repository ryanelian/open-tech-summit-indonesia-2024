"use server";

import { HydrateClient, api } from "~/trpc/server";
import { ToDoList } from "../components/todos/ToDoList";
import { CreateNewForm } from "../components/todos/CreateNewForm";

export default async function Home() {
	await api.todo.getAll.prefetch();

	return (
		<HydrateClient>
			<div className="flex flex-col gap-8 p-16 items-center">
				<h1 className="text-4xl">To-Do List</h1>
				<CreateNewForm />
				<ToDoList />
			</div>
		</HydrateClient>
	);
}
