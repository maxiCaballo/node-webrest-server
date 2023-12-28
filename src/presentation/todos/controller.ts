import { Request, Response } from 'express';

const todos = [
	{ id: 2, text: 'Buy bread', completedAt: new Date() },
	{ id: 1, text: 'Buy milk', completedAt: new Date() },
	{ id: 3, text: 'Buy eggs', completedAt: null },
];

export class TodosController {
	//Dependency Inyection
	constructor() {}

	public getTodos = (req: Request, res: Response) => {
		return res.json(todos);
	};
	public getTodoById = (req: Request, res: Response) => {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID argument is not a number' });
		}

		const todo = todos.find((todo) => todo.id === id);

		if (!todo) {
			return res.status(404).json({ error: 'Todo not found' });
		}

		return res.json(todo);
	};
	public createTodo = (req: Request, res: Response) => {
		const { text } = req.body;

		if (!text) {
			return res.status(400).json({ message: 'Text property is required' });
		}

		const todo = {
			id: todos.length + 1,
			text,
			completedAt: new Date(),
		};
		todos.push(todo);

		return res.json(todo);
	};
	public updateTodo = (req: Request, res: Response) => {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID argument is not a number' });
		}

		let newTodo = req.body;
		if (!newTodo.text) {
			return res.status(400).json({ message: 'Text property is required' });
		}

		const originalTodo = todos.find((todo) => todo.id === id);
		if (!originalTodo) {
			return res.status(404).json({ error: 'Todo not found' });
		}

		newTodo = {
			...originalTodo,
			text: newTodo.text,
			completedAt: newTodo.completedAt === 'null' ? null : new Date(newTodo.completedAt || originalTodo.completedAt),
		};

		todos.forEach((todo, index) => {
			if (todo.id === id) todos[index] = newTodo;
		});

		return res.json(newTodo);
	};
	public deleteTodo = (req: Request, res: Response) => {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID argument is not a number' });
		}

		const indexTodoToDelete = todos.findIndex((todo) => todo.id === id);
		if (indexTodoToDelete === -1) {
			return res.status(400).json({ message: 'Todo not found' });
		}

		todos.splice(indexTodoToDelete, 1);

		return res.json(todos);
	};
}
