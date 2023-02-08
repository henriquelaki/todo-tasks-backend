import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
	#database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

	#persist() {
		fs.writeFile(databasePath, JSON.stringify(this.#database));
	}

	select(table, search) {
		let data = this.#database[table] ?? [];
		if (search) {
			data = data.filter(row => {
				return Object.entries(search).some(([key, value]) => {
					return row[key].includes(value);
				});
			});
		}
		return data;
	}

	insert(table, data) {
        const user = { id: randomUUID(), ...data }
		if (Array.isArray(this.#database[table])) {
			this.#database[table].push(user);
		} else {
			this.#database[table] = [user];
		}

		this.#persist();

		return user;
	}

	delete(table, id) {
		const rowIndex = this.#database[table].findIndex(row => row.id === id);
		if(rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1)
			this.#persist()
			return true
		}
		return false
	}

	update(table, id, data) {
		const rowIndex = this.#database[table].findIndex(row => row.id === id);
		if(rowIndex > -1) {
			this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data }
			this.#persist()
			return true
		}
		return false
	}
}
