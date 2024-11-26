"use client";

import { api } from "~/trpc/react";

export function ToDoList() {
	const [data] = api.todo.getAll.useSuspenseQuery();
    
    if (data.length === 0) {
        return <div>No data</div>
    }

	return (
		<>
			{data.map((api) => (
				<div key={api.id}>{api.title}</div>
			))}
		</>
	);
}
