import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDTO, UpdateTodoDTO } from '../../domain/dtos/todos';

const todos = [
	{ id: 2, text: 'Buy bread', completedAt: new Date() },
	{ id: 1, text: 'Buy milk', completedAt: new Date() },
	{ id: 3, text: 'Buy eggs', completedAt: null },
];

export class TodosController {
	//Dependency Inyection
	constructor() {}

	public getTodos = async (req: Request, res: Response) => {
		const todos = await prisma.todo.findMany();
		return res.json(todos);
	};
	public getTodoById = async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID argument is not a number' });
		}

		const todo = await prisma.todo.findUnique({
			where: {
				id,
			},
		});

		if (!todo) {
			return res.status(404).json({ error: 'Todo not found' });
		}

		return res.json(todo);
	};
	public createTodo = async (req: Request, res: Response) => {
		const [error, todoDto] = CreateTodoDTO.create(req.body);

		if (error) {
			return res.status(400).json({ error });
		}
		const todo = await prisma.todo.create({
			data: todoDto!,
		});

		return res.json(todo);
	};
	public updateTodo = async (req: Request, res: Response) => {
		const id = Number(req.params.id);
		const [error, updateTodoDto] = UpdateTodoDTO.create({
			...req.body,
			id,
		});
		if (error) {
			return res.status(400).json({ error });
		}

		const todo = await prisma.todo.findUnique({
			where: {
				id,
			},
		});

		if (!todo) {
			return res.status(400).json({ error: `Todo with id ${id} not found` });
		}

		const updatedTodo = await prisma.todo.update({
			where: { id },
			data: updateTodoDto!.values, //Funcion getter
		});

		res.json(updatedTodo);
	};
	public deleteTodo = async (req: Request, res: Response) => {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'ID argument is not a number' });
		}

		try {
			const deletedTodo = await prisma.todo.delete({
				where: {
					id,
				},
			});
			return res.json(deletedTodo);
		} catch (error) {
			return res.status(400).json({ message: 'Todo not found' });
		}
	};
}
