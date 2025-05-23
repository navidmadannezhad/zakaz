export type PathEntity = string;

export interface FileExportAnalyzeResult {
    hasDefaultExport: boolean;
    namedExports: string[];
    reExports: string[];
}

export interface GenerateOrdersInDirectoryOptions {
    log?: boolean;
}