import { TodoEntity } from '../entities/todo.entity';
import { CreateTodoDTO } from '../dtos/todos/create-todo.dto';
import { UpdateTodoDTO } from '../dtos/todos/update-todo.dto';

export abstract class TodoRepository {
	abstract create(createTodoDto: CreateTodoDTO): Promise<TodoEntity>;
	abstract updateById(updateDto: UpdateTodoDTO): Promise<TodoEntity>;
	abstract findById(id: number): Promise<TodoEntity>;
	abstract deleteById(id: number): Promise<TodoEntity>;
	//todo: paginacion
	abstract getAll(): Promise<TodoEntity[]>;
}
