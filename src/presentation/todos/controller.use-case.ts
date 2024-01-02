import { Request, Response } from 'express';
import { CreateTodoDTO, UpdateTodoDTO } from '../../domain/dtos/todos';
import { TodoRepository } from '../../domain/repositories/todo.repository';
import { GetTodo, GetTodos, CreateTodo, DeleteTodo, UpdateTodo, CustomError } from '../../domain';

export class TodosController {
	//Dependency Inyection
	constructor(private readonly todoRepository: TodoRepository) {}

	private handleError = (res: Response, error: unknown) => {
		if (error instanceof CustomError) {
			res.status(error.statusCode).json({ error: error.message });
			return;
		}
		res.status(500).json({ error: 'Internal server error' });
	};

	public getTodos = async (req: Request, res: Response) => {
		new GetTodos(this.todoRepository)
			.execute()
			.then((todos) => res.json(todos))
			.catch((error) => this.handleError(res, error));
	};
	public getTodoById = async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		new GetTodo(this.todoRepository)
			.execute(id)
			.then((todo) => res.json(todo))
			.catch((error) => this.handleError(res, error));
	};
	public createTodo = async (req: Request, res: Response) => {
		const [error, todoDto] = CreateTodoDTO.create(req.body);

		if (error) {
			return res.status(400).json({ error });
		}

		new CreateTodo(this.todoRepository)
			.execute(todoDto!)
			.then((todo) => res.status(201).json(todo))
			.catch((error) => this.handleError(res, error));
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

		new UpdateTodo(this.todoRepository)
			.execute(updateTodoDto!)
			.then((updatedTodo) => res.json(updatedTodo))
			.catch((error) => this.handleError(res, error));
	};
	public deleteTodo = async (req: Request, res: Response) => {
		const id = Number(req.params.id);

		new DeleteTodo(this.todoRepository)
			.execute(id)
			.then((deletedTodo) => res.json(deletedTodo))
			.catch((error) => this.handleError(res, error));
	};
}
