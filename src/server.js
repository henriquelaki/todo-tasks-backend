import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
    
    const { method, url } = req;

	await json(req, res);

	const route = routes.find(route => {
		return route.method === method && route.path.test(url);
	})

	if (route) { 
		const routeParams = req.url.match(route.path);
		const { query, ...params } = routeParams.groups
		req.params = params
		req.query = query ? extractQueryParams(query) : {}
		return route.handler(req, res);
	}

	return res.writeHead(404).end();
});

server.listen(3335, () => {
    console.log('Server is running on port 3335');
});

process.on ('SIGINT', () => {
    server.close(() => {
        console.log('Server is closed');
        process.exit(0);
    });
});