const { startBot, register } = require('./files/discord')
const { generateRanks } = require('./files/generateRanks')
const { startServer } = require('./files/server')

const startUp = async () => {
	await generateRanks()
	await startBot()
	await register()
	await startServer()
}

startUp()