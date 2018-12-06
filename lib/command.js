const fs = require('fs')
const url = require('url')
const logger = require('graceful-logger')
const defaultParser = require('./handler')

exports.build = (cmd, opts) => {
  logger.info('build start')
  let {output} = cmd
  output = url.resolve(process.env.PWD + '/', output || './ajvp.json')
  logger.info('read config')
  let confDir = url.resolve(process.env.PWD + '/', './ajv-config.js')
  fs.writeFileSync(
    confDir,
    'module.exports = require("config")'
  )
  let config
  try {
    config = require(confDir)
  } catch (e) {
    return logger.error(e)
  }
  logger.info('read parser')
  let parser
  let parserDir = url.resolve(process.env.PWD + '/', './ajv-parser.js')
  if (fs.existsSync(parserDir)) {
    parser = require(parserDir)
  } else {
    parser = defaultParser
  }
  logger.info('start parse')
  let schema = parser.parse(config)
  logger.info('start output')
  fs.writeFileSync(output, JSON.stringify(schema, null, '\t'))
  fs.unlinkSync(confDir)
  logger.info('build success')
}
