import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {
	const todosPath = '/api/todos';

	const todo1 = { text: 'test 1' };
	const todo2 = { text: 'test 2' };

	beforeAll(async () => {
		await testServer.start();
	});
	afterAll(() => {
		testServer.close();
	});

	beforeEach(async () => {
		await prisma.todo.createMany({
			data: [todo1, todo2],
		});
	});

	afterEach(async () => {
		await prisma.todo.deleteMany();
	});

	test('should return todos /api/todos', async () => {
		const { body: todos } = await request(testServer.app).get(todosPath);

		expect(todos).toBeInstanceOf(Array);
		expect(todos.length).toBe(2);
		expect(todos[0].text).toBe(todo1.text);
		expect(todos[1].text).toBe(todo2.text);
	});
	test('should return todo /api/todos/:id', async () => {
		const createdTodo = await prisma.todo.create({ data: todo1 });
		const { body: todo } = await request(testServer.app).get(`${todosPath}/${createdTodo.id}`).expect(200);

		expect(todo).toEqual({
			id: expect.any(Number),
			text: expect.any(String),
			completedAt: null,
		});
	});
	test('should return 404 error if todo do not exist /api/todos/:id', async () => {
		//Arrange
		const todoId = 999999999;
		const expectedError = `Todo with id: ${todoId} not found`;
		const expectedHttpStatusCode = 404;

		//Act
		const { body: error } = await request(testServer.app).get(`${todosPath}/${todoId}`).expect(expectedHttpStatusCode);

		//Assert
		expect(error).toEqual({ error: expectedError });
	});
	test('should return a new Todo /api/todos', async () => {
		const { body } = await request(testServer.app).post(`${todosPath}`).send(todo1).expect(201);

		expect(body).toEqual({
			id: expect.any(Number),
			text: todo1.text,
			completedAt: null,
		});
	});
	test('should return an error if text value is empty /api/todos', async () => {
		const todoWithNoText = { text: '' };

		const { body } = await request(testServer.app).post(`${todosPath}`).send(todoWithNoText).expect(400);

		expect(body).toEqual({ error: 'Text property is required' });
	});
	test('should return an error if text value is not defined /api/todos', async () => {
		const todoWithNoTextProperty = {};

		const { body } = await request(testServer.app).post(`${todosPath}`).send(todoWithNoTextProperty).expect(400);

		expect(body).toEqual({ error: 'Text property is required' });
	});
	test('should return an updated todo PUT /api/todos/:id', async () => {
		//Arrange
		const todo = await prisma.todo.create({ data: todo1 });
		const newTextValue = 'Hello world updated';
		const newDateValue = '2024-01-01';
		const expectedDate = '2024-01-01T00:00:00.000Z';

		//Act
		const { body } = await request(testServer.app)
			.put(`${todosPath}/${todo.id}`)
			.send({
				text: newTextValue,
				completedAt: newDateValue,
			})
			.expect(200);

		//Assert
		expect(body).toEqual({
			id: todo.id,
			text: newTextValue,
			completedAt: expectedDate,
		});
	});
	test('should return an 404 error if todo not found PUT /api/todos/:id', async () => {
		//Arrange
		const newTextValue = 'Hello world updated';
		const newDateValue = '2024-01-01';
		const invalidId = 1;
		const expectedHttpStatusCode = 404;
		const expectedError = `Todo with id: ${invalidId} not found`;

		//Act
		const { body } = await request(testServer.app)
			.put(`${todosPath}/${invalidId}`)
			.send({
				text: newTextValue,
				completedAt: newDateValue,
			})
			.expect(expectedHttpStatusCode);

		//Assert
		expect(body).toEqual({
			error: expectedError,
		});
	});
	test('should return an 400 error if url do not have an id PUT /api/todos/:id', async () => {
		//Arrange
		await prisma.todo.create({ data: todo1 });
		const newTextValue = 'Hello world updated';
		const newDateValue = '2024-01-01';

		//Act
		const { body } = await request(testServer.app)
			.put(`${todosPath}/${undefined}`)
			.send({
				text: newTextValue,
				completedAt: newDateValue,
			})
			.expect(400);

		//Assert
		expect(body).toEqual({
			error: 'Invalid ID',
		});
	});
	test('should return an 400 error if url do not have a valid id PUT /api/todos/:id', async () => {
		//Arrange
		await prisma.todo.create({ data: todo1 });
		const newTextValue = 'Hello world updated';
		const newDateValue = '2024-01-01';
		const invalidId = 'abc';

		//Act
		const { body } = await request(testServer.app)
			.put(`${todosPath}/${invalidId}`)
			.send({
				text: newTextValue,
				completedAt: newDateValue,
			})
			.expect(400);

		//Assert
		expect(body).toEqual({
			error: 'Invalid ID',
		});
	});
	test('should return an updated todo only the date PUT /api/todos/:id', async () => {
		//Arrange
		const todo = await prisma.todo.create({ data: todo1 });
		const newDateValue = '2024-01-01';
		const expectedDate = '2024-01-01T00:00:00.000Z';
		const expectedHttpStatusCode = 200;

		//Act
		const { body } = await request(testServer.app)
			.put(`${todosPath}/${todo.id}`)
			.send({ completedAt: newDateValue })
			.expect(expectedHttpStatusCode);

		//Assert
		expect(body).toEqual({
			id: todo.id,
			text: todo.text,
			completedAt: expectedDate,
		});
	});
	test('should delete todo DELETE /api/todos/:id', async () => {
		//Arrange
		const todo = await prisma.todo.create({ data: todo1 });
		const expectedHttpStatusCode = 200;

		//Act
		const { body } = await request(testServer.app).put(`${todosPath}/${todo.id}`).expect(expectedHttpStatusCode);

		//Assert
		expect(body).toEqual({
			id: todo.id,
			text: todo.text,
			completedAt: null,
		});
	});
	test('should return 404 error if todo do not exist DELETE /api/todos/:id', async () => {
		//Arrange
		await prisma.todo.create({ data: todo1 });
		const invalidId = 99999999;
		const expectedHttpStatusCode = 404;

		//Act
		const { body } = await request(testServer.app).put(`${todosPath}/${invalidId}`).expect(expectedHttpStatusCode);

		//Assert
		expect(body).toEqual({
			error: `Todo with id: ${invalidId} not found`,
		});
	});
});
