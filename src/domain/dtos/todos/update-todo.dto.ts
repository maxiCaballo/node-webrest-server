export class UpdateTodoDTO {
	private constructor(public readonly id: number, public readonly text: string, public readonly completedAt?: Date) {}

	get values() {
		const returnObj: { [key: string]: any } = {};

		if (this.text) returnObj.text = this.text;
		if (this.completedAt) returnObj.completedAt = this.completedAt;

		return returnObj;
	}

	static create(props: { [key: string]: any }): [string?, UpdateTodoDTO?] {
		const { id, text, completedAt } = props;

		if (!id || isNaN(Number(id))) {
			return ['Invalid ID'];
		}

		let newCompletedAt = completedAt;
		if (completedAt) {
			newCompletedAt = new Date(completedAt);
			if (newCompletedAt.toDateString() === 'Invalid Date') {
				return ['Invalid date'];
			}
		}
		return [undefined, new UpdateTodoDTO(id, text, newCompletedAt)];
	}
}
