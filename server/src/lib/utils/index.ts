

import fs from 'node:fs/promises'
import path from 'path'

export async function generateFileTree(directory: any) {
    const tree = {}

    async function buildTree(currentDir: any, currentTree: any) {
        const files = await fs.readdir(currentDir)

        for (const file of files) {
            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }
    }

    await buildTree(directory, tree);
    return tree
}