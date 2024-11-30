import { $ } from 'bun'
import { resolve } from 'node:path'

console.log(resolve(__dirname, '../'))
$.cwd(resolve(__dirname, '../'))
