import {
    readdir,
    writeFile
} from "fs/promises";
import { fileExists, generateExportContent, getFolderEntitiesFromPathEntities, isDirectory } from "./utils";
import type { PathEntity } from "./types";

const TARGET_DIRECTORY: string = "./test/components";
const RESTRICTED_DIRECTORIES: string[] = [
    'api', 'assets'
]; 

const generateOrdersInDirectory = async (path: string): Promise<void> => {
    const pathEntities: PathEntity[] = await readdir(path);
    const folders = await getFolderEntitiesFromPathEntities(path, pathEntities);

    const indexExists = await fileExists(`${path}/index.ts`);
    const content = await generateExportContent(path, pathEntities);

    if(!indexExists) await writeFile(`${path}/index.ts`, content, { 
        flag: indexExists ? "a" : "w"
    });

    for(const folderPath of folders){
        if(!RESTRICTED_DIRECTORIES.find(dir => path.endsWith(dir))){
            generateOrdersInDirectory(folderPath)
        }
    }
}

await generateOrdersInDirectory(
    TARGET_DIRECTORY
);