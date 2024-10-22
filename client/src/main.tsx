import "./index.css"

import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"

import useTodos from "./hooks/todos"

function App() {
	const { todos, addTodo, storageMethod, removeTodo, toggleStorage } =
		useTodos()
	const [input, setInput] = useState("")

	return (
		<div className="flex flex-col items-center">
			<div className="bg-slate-50 navbar">
				<div className="navbar-start"></div>
				<div className="navbar-center">
					<a className="btn btn-ghost text-xl">Todos</a>
				</div>
				<div className="navbar-end"></div>
			</div>

			<div className="my-2">
				<p>
					Toggle storage:{" "}
					<button onClick={() => toggleStorage()} className="btn">{`${
						storageMethod ? "DB" : "Browser Memory"
					}`}</button>
				</p>
			</div>

			<form
				className="border-base-200 flex flex-row self-stretch justify-center pb-4 mt-4 border-b-2"
				onSubmit={(e) => {
					e.preventDefault()

					addTodo(input)
					setInput("")
				}}
			>
				<input
					type="text"
					placeholder="Type here"
					name="todo-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="input input-bordered w-full max-w-xs"
				/>
			</form>

			<div className="flex flex-col self-stretch w-full max-w-sm mx-auto mt-5">
				{todos.map((todo, index) => (
					<div
						key={index}
						className="hover:bg-slate-50 flex flex-row items-center justify-between w-full gap-2 p-2 rounded"
					>
						<p className="text-lg font-semibold">{todo.body}</p>
						<button
							onClick={() => removeTodo(index)}
							className="btn btn-sm btn-error"
						>
							Remove
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
