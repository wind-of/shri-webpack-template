import * as fs from "fs"
import { Compiler } from "webpack"

type Options = {
    templatePath: string,
    pathToSave: string
    whitelist?: Array<RegExp>
}

class ModuleLogger {
    private files: Set<string> = new Set()
    private pathToSave: string
    private whitelist: Array<RegExp>
    constructor({ templatePath, pathToSave, whitelist }: Options) {
        this.pathToSave = pathToSave
        this.whitelist = whitelist
        this.readDirectory(templatePath)
    }
    apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('ModuleLogger', (stats) => {
            stats.compilation.modules.forEach(module => {
                //@ts-ignore Чуваки на вебпаке типы не дописали?
                const modulePath = module.resource
                if (typeof modulePath === "string") {
                    this.files.delete(modulePath)
                }
            })
            this.saveUnusedFiles()
        })
    }
    saveUnusedFiles() {
        fs.writeFileSync(this.pathToSave, JSON.stringify(Array.from(this.files)))
    }
    readDirectory(path: string) {
        const files = fs.readdirSync(path)
        for (const file of files) {
            const newPath = `${path}/${file}`
            const isDirectory = fs.statSync(newPath).isDirectory()
            if (isDirectory) {
                this.readDirectory(newPath)
            } else if(this.isNotInWhitelist(file)) {
                this.files.add(newPath)
            }
        }
    }
    isNotInWhitelist(string: string) {
        return !this.whitelist.some((r) => r.test(string))
    }
}

export default ModuleLogger;