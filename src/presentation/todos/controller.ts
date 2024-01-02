import { Request, Response } from 'express';
import { CreateTodoDTO, UpdateTodoDTO } from '../../domain/dtos/todos';
import { TodoRepository } from '../../domain/repositories/todo.repository';

export class TodosController {
	//Dependency Inyection
	constructor(private readonly todoRepository: TodoRepository) {}

	public getTodos = async (req: Request, res: Response) => {
		const todos = await this.todoRepository.getAll();
		return res.json(todos);
	};
	public getTodoById = async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		try {
			const todo = await this.todoRepository.findById(id);
			return res.json(todo);
		} catch (error) {
			res.status(400).json({ error });
		}
	};
	public createTodo = async (req: Request, res: Response) => {
		const [error, todoDto] = CreateTodoDTO.create(req.body);

		if (error) {
			return res.status(400).json({ error });
		}
		const todo = await this.todoRepository.create(todoDto!);
		return res.status(201).json(todo);
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

		const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
		return res.json(updatedTodo);
	};
	public deleteTodo = async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		const deletedTodo = this.todoRepository.deleteById(id);
		return res.json(deletedTodo);
	};
}
