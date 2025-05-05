import {
    readdir,
    writeFile
} from "fs/promises";
import { fileExists, generateExportContent, getFolderEntitiesFromPathEntities } from "./utils";
import type { PathEntity } from "./types";

const TARGET_DIRECTORY: string = "./test/configs";
const RESTRICTED_DIRECTORIES: string[] = []; 

const generateOrdersInDirectory = async (path: string): Promise<void> => {

    const pathEntities: PathEntity[] = await readdir(path);
    const folders = await getFolderEntitiesFromPathEntities(path, pathEntities);

    const data = await generateExportContent(path, pathEntities);
    console.log(data)

    const indexExists = await fileExists(`${path}/index.ts`);

    const content = await generateExportContent(path, pathEntities);

    if(!indexExists) await writeFile(`${path}/index.ts`, content, { 
        flag: indexExists ? "a" : "w"
    });

}

await generateOrdersInDirectory(TARGET_DIRECTORY);