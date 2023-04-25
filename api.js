/**
 * Module Dependencies
 */
const config = require('./config')
const restify = require('restify')
require('restify').plugins

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,
})

/**
 * Middleware
 */
server.pre(function crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods'
    )
    return next()
})
server.opts('*', (req, res, next) => {
    res.header('Access-Control-Allow-Methods', '*')
    res.send(204)
    return next()
})
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.queryParser({ mapParams: true }))

/**
 * Sync DB, Require Routes, Start Server
 */
const db = require('./db.js')
require('./routes/index')(server, db)

// drop and resync with { force: true },
db.sequelize.sync().then(() => {
    server.listen(config.port, () => {
        console.log(`Server is listening on port ${config.port}`)
    })
})
