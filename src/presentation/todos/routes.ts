import { Router } from 'express';
import { TodosController } from './controller.use-case';
import { TodoDataSourceImpl } from '../../infrastructure/datasource/todo.datasource.impl';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodoRoutes {
	static get routes(): Router {
		const router = Router();

		const datasource = new TodoDataSourceImpl();
		const todoRepository = new TodoRepositoryImpl(datasource);

		const todosController = new TodosController(todoRepository);

		router.get('/', todosController.getTodos);
		router.get('/:id', todosController.getTodoById);

		router.post('/', todosController.createTodo);
		router.delete('/:id', todosController.deleteTodo);
		router.put('/:id', todosController.updateTodo);

		return router;
	}
}
