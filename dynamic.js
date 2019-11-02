const fs = require('fs').promises
const execSync = require('child_process').execSync

const commit_time_raw = execSync('git show -s --format=%ct HEAD').toString()
const commit_time = commit_time_raw.replace('\n', '')

const object = {
	commit_time: commit_time
}

const json = JSON.stringify(object)

fs.writeFile('dynamic/info', json)
