import { prisma } from '../../data/postgres';
import { CreateTodoDTO, TodoEntity, UpdateTodoDTO, TodoDataSource } from '../../domain';
import { CustomError } from '../../domain';

export class TodoDataSourceImpl implements TodoDataSource {
	async create(createTodoDto: CreateTodoDTO): Promise<TodoEntity> {
		const todo = await prisma.todo.create({
			data: createTodoDto,
		});

		return TodoEntity.fromObject(todo);
	}
	async findById(id: number): Promise<TodoEntity> {
		const todo = await prisma.todo.findUnique({
			where: {
				id,
			},
		});

		if (!todo) {
			throw new CustomError(`Todo with id: ${id} not found`, 404);
		}

		return TodoEntity.fromObject(todo);
	}
	async updateById(updateTodoDto: UpdateTodoDTO): Promise<TodoEntity> {
		await this.findById(updateTodoDto.id);

		const updatedTodo = await prisma.todo.update({
			where: { id: updateTodoDto.id },
			data: updateTodoDto.values,
		});

		return TodoEntity.fromObject(updatedTodo);
	}
	async deleteById(id: number): Promise<TodoEntity> {
		await this.findById(id);

		const deletedTodo = await prisma.todo.delete({
			where: {
				id,
			},
		});

		return TodoEntity.fromObject(deletedTodo);
	}
	async getAll(): Promise<TodoEntity[]> {
		const todos = await prisma.todo.findMany();
		return todos.map((todo) => TodoEntity.fromObject(todo));
	}
}
