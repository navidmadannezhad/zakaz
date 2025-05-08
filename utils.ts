import {
    exists, 
    lstat,
    writeFile
} from "fs/promises";
import type { FileExportAnalyzeResult, PathEntity } from "./types";
import { analyzeExports } from "./exportAnalyzeEngine";

export const fileExists = async (path: string): Promise<boolean> => await exists(path);

export const isDirectory = async (path: string): Promise<boolean> => {
    let isDirectory: boolean = false;

    const isValidPath: boolean = !!(await lstat(path));
    if(isValidPath) isDirectory = (await lstat(path)).isDirectory();

    return isDirectory;
}

export const isValidScriptFile = (path: string): boolean => {
    return /\.(ts|js|tsx|jsx)$/i.test(path);
}

export const getFileEntitiesFromPathEntities = async (basePath: string, pathEntities: PathEntity[]): Promise<PathEntity[]> => {
    let files: PathEntity[] = [];

    for(const entity of pathEntities){
        const rel_path = `${basePath}/${entity}`
        let isFile = !(await isDirectory(rel_path));
        let isValid = isValidScriptFile(rel_path);

        if(isFile && isValid) files.push(rel_path);
    }

    return files;
}

export const getFolderEntitiesFromPathEntities = async (basePath: string, pathEntities: PathEntity[]): Promise<PathEntity[]> => {
    let folders: PathEntity[] = [];

    for(const entity of pathEntities){
        const rel_path = `${basePath}/${entity}`
        let isFolder = !!(await isDirectory(rel_path));

        if(isFolder) folders.push(rel_path);
    }

    return folders;
}

export const generateExportContent = async (basePath: string, pathEntities: PathEntity[]): Promise<string> => {
    let files = await getFileEntitiesFromPathEntities(basePath, pathEntities);
    let folders = await getFolderEntitiesFromPathEntities(basePath, pathEntities);

    let exportContent: string = "";

    for(const folderPath of folders){
        const folderName = folderPath.split("/")[folderPath.split("/").length - 1];
        if(folderName) exportContent = exportContent + `export * from "./${folderName}"\n`;
    }

    for(const filePath of files){
        const result: FileExportAnalyzeResult = analyzeExports(filePath);
        console.log(filePath)
        console.log(filePath.split("."))
        const filePathWithoutFormat: string = filePath.split("/")?.slice(-1)[0]?.split(".")[0];

        if(result.namedExports.length){
            exportContent = exportContent + `export * from "./${filePathWithoutFormat}"\n`;
        }

        if(result.hasDefaultExport){
            exportContent = exportContent + `export { default as ${result.reExports[0]} } from "./${filePathWithoutFormat}"\n`;
        }
    }

    return exportContent;
}

export const populateIndexFile = async (path: string, content: string) => {
    const indexExists = await fileExists(`${path}/index.ts`);

    if(!indexExists) await writeFile(`${path}/index.ts`, content, { 
        flag: indexExists ? "a" : "w"
    });
}