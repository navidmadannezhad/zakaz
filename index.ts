import {
    readdir,
    writeFile
} from "fs/promises";
import { fileExists, generateExportContent, getFolderEntitiesFromPathEntities, isDirectory, populateIndexFile } from "./utils";
import type { PathEntity } from "./types";

const TARGET_DIRECTORY: string = "./test/components";
const RESTRICTED_DIRECTORIES: string[] = [
    'api', 'assets'
]; 

// when there is a currently index.tsx file, the content shouldn't be overrided, and the repeated lines shouldn't be generated
// turn this code into a library

const generateOrdersInDirectory = async (path: string): Promise<void> => {
    const pathEntities: PathEntity[] = await readdir(path);
    const folders = await getFolderEntitiesFromPathEntities(path, pathEntities);
    const content = await generateExportContent(path, pathEntities);
    await populateIndexFile(path, content);

    for(const folderPath of folders){
        if(!RESTRICTED_DIRECTORIES.find(dir => path.endsWith(dir))){
            generateOrdersInDirectory(folderPath)
        }
    }
}

await generateOrdersInDirectory(
    TARGET_DIRECTORY
);