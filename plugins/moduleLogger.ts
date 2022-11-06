import { writeFileSync } from 'fs';
import { Compiler } from 'webpack';

import { readDirectory } from "../readDirectory"

const whiteList = [
    /.*node_modules.*/,
    /\.json$/,
    /.*plugins.*/,
    /\.config\.[tj]s$/,
    /README\.md$/,
    /\.git.*$/,
    /\.nvmrc$/,
    /\.prettierrc\.yaml$/,
    /index\.html$/,
    /readDirectory.ts/,
    /.*LICENSE.txt/i,
    /.*dist.*/
]

class ModuleLogger {
    wholeDirectoryFiles: Set<string> = new Set()
    usedFiles: Set<string> = new Set()
    apply(compiler: Compiler) {
        compiler.hooks.beforeRun.tap(
            "ReadDirectory",
            () => this.wholeDirectoryFiles = new Set(readDirectory(whiteList))
        )
        compiler.hooks.normalModuleFactory.tap(
            'ModuleLogger',
            (normalModuleFactory) => {
                normalModuleFactory.hooks.module.tap('ModuleLogger', (_module, _createData) => {
                    if (!whiteList.some((re) => re.test(_createData.resource))) {
                        this.usedFiles.add(_createData.resource)
                    }
                    return _module
                })
            }
        )
        compiler.hooks.done.tap(
            'HelloWorld',
            () => {
                const unused: Array<string> = []
                this.wholeDirectoryFiles.forEach((key) => {
                    if (!this.usedFiles.has(key)) {
                        unused.push(key)
                    }
                })
                writeFileSync()
            }
        )
    }
}

export default ModuleLogger;