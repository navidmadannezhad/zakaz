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

const generateOrdersInDirectory = async (path: string, restricted_dirs: string[] = []): Promise<void> => {
    const pathEntities: PathEntity[] = await readdir(path);
    const folders = await getFolderEntitiesFromPathEntities(path, pathEntities);
    const content = await generateExportContent(path, pathEntities);
    await populateIndexFile(path, content);

    for(const folderPath of folders){
        console.log(folderPath)
        // WIP -- COMPONENTS FOLDER STILL GETTING ZAKAZED ALTHOUGH IT'S IN RESTRICTED ROUTS
        console.log("./test/components".endsWith("components"))
        console.log(!restricted_dirs.find(dir => path.endsWith(dir)))
        console.log("====")
        if(!restricted_dirs.find(dir => path.endsWith(dir))){
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
    .option('-b, --entry-path <entry_path>', 'Entry Path', '')
    .action(async (options) => {
        try{
            if(!options.entryPath) throw new Error("Please specify the -b entry_path");

            console.log(options.restrictedDirs.replaceAll(' ', '').split(","))

            await generateOrdersInDirectory(
                options.entryPath,
                options.restrictedDirs.replaceAll(' ', '').split(",")
            )
        }catch(e: any){
            console.log("ERROR in ZAKAZ");
            console.log(e.message)
        }
    });

program
    .command('testGen')
    .description('Test')
    .action(async (_options) => {
        await generateOrdersInDirectory(
            "./test",
            ['api']
        )
    });

program
    .command('test')
    .description('Test')
    .action(async (_options) => {
        console.log("Hello from zakaz!")
    });

program.parseAsync(process.argv).catch(console.error);