import ts from "typescript";
import type { FileExportAnalyzeResult } from "./types";

export const analyzeExports = (filePath: string): FileExportAnalyzeResult | null => {
    try {
        const program = ts.createProgram([filePath], {});
        const sourceFile = program.getSourceFile(filePath);

        const result = {
            hasDefaultExport: false,
            namedExports: [],
            reExports: []
        } as any;

        ts.forEachChild(sourceFile as any, node => {

            // finds export default = ts.isExportAssignment(node) (and export = {} in commonJS)
            // finds export {} = ts.isExportDeclaration(node)

            if (ts.isExportAssignment(node)) {
                result.hasDefaultExport = true;
                result.reExports.push((node.expression as any)?.text);
            } else if (ts.isExportDeclaration(node)) {
                if (node.exportClause) {
                    if (ts.isNamedExports(node.exportClause)) {
                        node.exportClause.elements.forEach(element => {
                        result.namedExports.push(element.name.text);
                        });
                    }
                }
                if (node.moduleSpecifier) {
                    result.reExports.push({
                        source: (node.moduleSpecifier as any).text,
                        specifiers: node.exportClause && ts.isNamedExports(node.exportClause)
                        ? node.exportClause.elements.map(el => ({
                            local: el.propertyName ? el.propertyName.text : el.name.text,
                            exported: el.name.text
                            }))
                        : []
                    });
                }
            } else if (
                ts.isFunctionDeclaration(node) || 
                ts.isClassDeclaration(node) ||
                ts.isVariableStatement(node)
            ) {
                if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
                if (node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) {
                    result.hasDefaultExport = true;
                } else {
                    // Handle named exports
                    if (ts.isVariableStatement(node)) {
                        node.declarationList.declarations.forEach(decl => {
                            if (ts.isIdentifier(decl.name)) {
                            result.namedExports.push(decl.name.text);
                            }
                        });
                    } else if (node.name) {
                        result.namedExports.push(node.name.text);
                    }
                }
                }
            }
        });

        return result;
    } catch (err) {
        console.error(`Error analyzing ${filePath}:`, err);
        return null;
    }
}