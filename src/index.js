import "dotenv/config";

import { Client, Collection } from "eris";
import { readdir, readFile } from "fs/promises";

export const config = JSON.parse(await readFile("./src/config/config.json", "utf-8"))

export const client = new Client(process.env.TOKEN, { restMode: true });
client.editStatus("online", [{
    type: config.status.type,
    name: config.status.name,
    url: config.status.url
}])

const getAllFiles = async (path, folder = "") => {
    const paths = await readdir(path, { withFileTypes: true });
    const results = paths.filter(path => path.isFile()).map(({ name }) => `${folder}/${name}`)

    const dirs = (await Promise.all(
        paths.filter(path => path.isDirectory())
            .map(({ name }) => getAllFiles(`${path}/${name}`, `/${folder}/${name}`))
    )).flat()

    return [...results, ...dirs]
}

export const commands = new Collection(null, null);

(await getAllFiles("./src/commands")).forEach(async (path) => {
    const { command } = await import("./commands" + path);
    commands.set(command.name, command);
});

(await getAllFiles("./src/events")).forEach(async (path) => {
    const event = await import("./events" + path);
    client.on(event.name, event.run);
});

await client.connect()