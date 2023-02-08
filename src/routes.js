import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { validateBody } from "./utils/validateBody.js";

const database = new Database();

export const routes = [
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
            const { search } = req.query
			const task = database.select("tasks", search ? {
                title: search,
                description: search
            } : null);
			return res.end(JSON.stringify(task));
		},
	},
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
            if(!validateBody(req.body)) {
                return res.writeHead(400).end()
            }

			const { title, description } = req.body;

            const currentDate = new Date().toISOString()
			const task = {
				title,
                description,
                completed_at: null,
                created_at: currentDate,
                updated_at: currentDate
			};

			database.insert("tasks", task);

			return res.writeHead(201).end();
		},
	},
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } =  req.params
            const response = database.delete('tasks', id) ? 
                { code: 204, msg: null} : 
                { code: 404, msg: 'Task not found' }
            return res.writeHead(response.code).end(JSON.stringify(response.msg))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            if(!validateBody(req.body)) {
                return res.writeHead(400).end()
            }
            const currentDate = new Date().toISOString()
            const { id } = req.params
            const { title, description } = req.body
            const data = { title, description, updated_at: currentDate }
            const response = database.update('tasks', id, JSON.parse(JSON.stringify(data))) ? 
                { code: 204, msg: null} : 
                { code: 404, msg: 'Task not found' }
            return res.writeHead(response.code).end(JSON.stringify(response.msg))
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const currentDate = new Date().toISOString()
            const { id } = req.params
            const data = { completed_at: currentDate }
            const response = database.update('tasks', id, data) ? 
                { code: 204, msg: null} : 
                { code: 404, msg: 'Task not found' }
            return res.writeHead(response.code).end(JSON.stringify(response.msg))
        }
    }
];
