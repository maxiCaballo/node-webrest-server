import { CreateTodoDTO, TodoDataSource, TodoEntity, TodoRepository, UpdateTodoDTO } from '../../domain';

export class TodoRepositoryImpl implements TodoRepository {
	constructor(private readonly dataSource: TodoDataSource) {}

	create(createTodoDto: CreateTodoDTO): Promise<TodoEntity> {
		return this.dataSource.create(createTodoDto);
	}
	updateById(updateDto: UpdateTodoDTO): Promise<TodoEntity> {
		return this.dataSource.updateById(updateDto);
	}
	findById(id: number): Promise<TodoEntity> {
		return this.dataSource.findById(id);
	}
	deleteById(id: number): Promise<TodoEntity> {
		return this.dataSource.deleteById(id);
	}
	getAll(): Promise<TodoEntity[]> {
		return this.dataSource.getAll();
	}
}

//El constructor recibe como parametro un TodoDataSource del dominio y no de la implementacion para que pueda recibir
//Cualquier implementacion de datasource y no solo una por ejemplo PostgreSQLDatasource, MongoDBDatasource etc..
