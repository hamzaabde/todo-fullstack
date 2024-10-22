const dotenv = require("dotenv")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { pool, migrate } = require("./db")
const app = express()

dotenv.config()

const PORT = process.env.PORT || 3000

app.use(
	cors({
		origin: process.env.ALLOWED_HOSTS.split(","),
	})
)
app.use(bodyParser.json())

app.get(
	"/todos",
	wrap(async (req, res) => {
		const { rows } = await pool.query("SELECT * FROM todos")

		res.status(200).json(rows)
	})
)

app.post(
	"/todos",
	wrap(async (req, res) => {
		const { body } = req.body
		await pool.query("INSERT INTO todos (body) VALUES ($1)", [body])

		const { rows } = await pool.query("SELECT * FROM todos")
		res.status(201).json(rows)
	})
)

app.delete(
	"/todos/:id",
	wrap(async (req, res) => {
		const { id } = req.params

		await pool.query("DELETE FROM todos WHERE id = $1", [id])

		res.status(201).json({ message: "Todo deleted" })
	})
)

app.post(
	"/todos/sync",
	wrap(async (req, res) => {
		const { todos } = req.body

		await pool.query("TRUNCATE todos")

		if (!todos)
			return res
				.status(201)
				.json({ message: "No todos to sync, but deleted all for yu!" })

		for (const todo of todos) {
			await pool.query("INSERT INTO todos (body) VALUES ($1)", [todo.body])
		}

		const { rows } = await pool.query("SELECT * FROM todos")

		res.status(204).json(rows)
	})
)

app.use((err, req, res, next) => {
	console.error(err)
	res.status(500).json({ message: "Something went wrong" })
})

function wrap(fn) {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

function main() {
	// check if migration if migration is needed
	pool
		.query(`SELECT * FROM migrations`)
		.then(({ row }) => {
			if (row.length === 0) {
				console.log("Running migration")
				migrate()
					.then(() => {
						console.log("Migration complete")
					})
					.catch((err) => {
						console.error(err)
						process.exit(1)
					})
			}
		})
		.catch(() => {
			console.log("Running migration")
			migrate().then(() => {
				console.log("Migration complete")
			})
		})

	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`)
	})
}

main()
