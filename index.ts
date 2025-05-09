#!/usr/bin/env bun

import {
    readdir,
} from "fs/promises";
import { 
    generateExportContent, 
    getFolderEntitiesFromPathEntities, 
    populateIndexFile 
} from "./utils";
import type { PathEntity } from "./types";
import { Command } from "commander";

const RESTRICTED_DIRECTORIES: string[] = [
    'api', 'assets'
]; 

const generateOrdersInDirectory = async (path: string, restricted_dirs: string[] = []): Promise<void> => {
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

const program = new Command();

program
    .name('zakaz')
    .description('Simple CLI to order your named exports and default exports in an index.ts file')
    .version('1.0.0')
    .option('-r, --restricted-dirs <restricted_dirs>', 'restricted paths', "")
    .option('-b, --entry-path <entry_path>', 'Entry Path', './')
    .action(async (options) => {
        await generateOrdersInDirectory(
            options.entryPath,
            options.restrictedDirs.replaceAll(' ', '').split(",")
        )
    });

program
    .command('test')
    .description('Test')
    .action(async (_options) => {
        await generateOrdersInDirectory(
            "./test/configs",
            ['api', 'assets']
        )
    });

program.parse();