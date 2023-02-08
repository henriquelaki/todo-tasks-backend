import { parse } from 'csv-parse';
import fs from 'node:fs';

const filePath = new URL('../tasks.csv', import.meta.url);
const fileStream = fs.createReadStream(filePath);
const fileParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

const loadCsv = async () => {
    const fileContent = fileStream.pipe(fileParse)

    for await (const line of fileContent) {
        const [ title, description ] = line

        await fetch('http://localhost:3335/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
    }
}

loadCsv()