import Bun, { $, Glob } from 'bun'

import manifest from '../public/manifest.json'
import './cwd'

const outdir = './build'

const {
    content_scripts,
    background: { service_worker },
} = manifest

const scripts = content_scripts.flatMap((script) => script.js)

const resolveEntryPoints = (entrypoints: string[]) => {
    return entrypoints.map((entrypoint) => `./src/${entrypoint}`)
}

const publicFolder = './public'

await $`rm -rf ${outdir}`

const ext = {
    html: '.html',
    png: '.png',
    css: '.css',
}

await Bun.build({
    target: 'browser',
    entrypoints: resolveEntryPoints([...scripts, service_worker, 'options/index.tsx', 'popup/index.tsx']),
    outdir,
})

const glob = new Glob('**')

const globalCssFile = Bun.file(`${publicFolder}/global.css`)

if (!globalCssFile.exists()) throw new Error('global.css not found')

for await (const filename of glob.scan(publicFolder)) {
    const file = Bun.file(`${publicFolder}/${filename}`)

    if (!file.exists()) throw new Error(`File ${filename} does not exist`)

    if (filename.endsWith(ext.png) || filename.endsWith(ext.css)) continue

    if (filename.endsWith(ext.html)) {
        const fileFolder = filename.replace(ext.html, '')

        await $`mkdir -p ${outdir}/${fileFolder}`

        await $`cp ${file.name} ${outdir}/${fileFolder}/index.html`

        await $`bun run css -- ${globalCssFile.name} -o ${outdir}/${fileFolder}/global.css`.quiet()
    } else {
        await $`cp ${file.name} ${outdir}`
    }
}

await $`cp -R ${publicFolder}/icons ${outdir}`
