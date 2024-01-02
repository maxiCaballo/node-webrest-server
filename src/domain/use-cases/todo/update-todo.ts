import { UpdateTodoDTO } from '../../dtos/todos';
import { TodoEntity } from '../../entities/todo.entity';
import { TodoRepository } from '../../repositories/todo.repository';

export interface UpdateTodoUseCase {
	execute(updateDto: UpdateTodoDTO): Promise<TodoEntity>;
}

export class UpdateTodo implements UpdateTodoUseCase {
	constructor(private readonly repository: TodoRepository) {}

	execute(updateDto: UpdateTodoDTO): Promise<TodoEntity> {
		return this.repository.updateById(updateDto);
	}
}
