const fs = require('fs').promises
const execSync = require('child_process').execSync

const commit_hash_raw = execSync('git rev-parse --short HEAD').toString()
const commit_hash = commit_hash_raw.replace('\n', '')

const object = {
	commit_hash: commit_hash
}

const json = JSON.stringify(object)

fs.writeFile('dynamic/info', json)

fs.appendFile('serviceworker.js', "const cacheVersion = '" + commit_hash + "';\n")
