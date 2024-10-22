import { useState, useEffect } from "react"

// import axios from "axios"

// const API_URL = "https://jsonplaceholder.typicode.com/todos"

export type Todo = {
	id: number
	body: string
}

export default function useTodos() {
	const [todos, setTodos] = useState<Todo[]>([])
	const [storageMethod, toggleStorageMethod] = useState<boolean>(false)

	const addTodo = (body: string) => {
		const id =
			todos.reduce((acc, curr) => (curr.id > acc ? curr.id : acc), 0) + 1
		setTodos([...todos, { id, body }])
	}

	const removeTodo = (index: number) => {
		setTodos(todos.filter((_, i) => i !== index))
	}

	return {
		todos,
		addTodo,
		removeTodo,
		storageMethod,
		toggleStorage: (): void => toggleStorageMethod(!storageMethod),
	}
}
