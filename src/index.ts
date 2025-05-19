#!/usr/bin/env bun

import {
    readdir,
} from "fs/promises";
import { 
    generateExportContent, 
    getFolderEntitiesFromPathEntities, 
    populateIndexFile 
} from "./utils";
import type { GenerateOrdersInDirectoryOptions, PathEntity } from "./types";
import { Command } from "commander"; 

const generateOrdersInDirectory = async (path: string, restricted_dirs: string[] = [], options: GenerateOrdersInDirectoryOptions = {}): Promise<void> => {
    const { log } = options;

    const pathEntities: PathEntity[] = await readdir(path);
    const folders = await getFolderEntitiesFromPathEntities(path, pathEntities);
    const content = await generateExportContent(path, pathEntities);
    await populateIndexFile(path, content);

    for(const folderPath of folders){
        if(!restricted_dirs.find(dir => folderPath.endsWith(dir))){
            if(log) console.log("Processing: ", folderPath);
            await generateOrdersInDirectory(folderPath, restricted_dirs, options)
            if(log) console.log("Completed: ", folderPath);
        }
    }
}

const program = new Command();

program
    .name('zakaz')
    .description('Simple CLI to order your named exports and default exports in an index.ts file')
    .version('1.0.0')
    .option('-d, --restricted-dirs <restricted_dirs>', 'restricted paths, seperated by comma', "")
    .option('-b, --entry-path <entry_path>', 'Entry Path', '')
    .option('-l, --log', "Should we have the process log? or that's just too much?")
    .action(async (options) => {
        try{
            if(!options.entryPath) throw new Error("Please specify the -b entry_path");

            await generateOrdersInDirectory(
                options.entryPath,
                options.restrictedDirs.replaceAll(' ', '').split(","),
                { log: options.log }
            )
        }catch(e: any){
            console.error("ERROR in ZAKAZ !!");
            console.log(e.message)
        }
    });

program.parseAsync(process.argv).catch(console.error);