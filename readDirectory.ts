const fs = require("fs")
// @ts-ignore
export function readDirectory(whiteList, path = __dirname): Array<string> {
    const result: Array<string> = []// @ts-ignore
    const files = fs.readdirSync(path)
    for (let file of files) {//@ts-ignore
        if (whiteList.some((r) => r.test(file))) {
            continue
        }// @ts-ignore
        const status = fs.statSync(`${path}\\${file}`)
        if (status.isDirectory()) {// @ts-ignore
            result.push(...readDirectory(whiteList, path + '\\' + file))
        } else {
            result.push(`${path}\\${file}`)
        }
    }
    return result
}

export function saveUnused(array) {
    
}
