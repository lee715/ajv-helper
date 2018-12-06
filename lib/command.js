const fs = require('fs')
const logger = require('graceful-logger')
const defaultParser = require('./handler')

exports.build = (cmd, opts) => {
  logger.info('build start')
  let config
  try {
    config = require('config')
  } catch (e) {
    logger.error('config not found')
  }
  let parser
  if (fs.existsSync('./ajv-parser.js')) {
    parser = require('./ajv-parser.js')
  } else {
    parser = defaultParser
  }
  let schema = parser.parse(config)
  fs.writeFileSync('./ajv-schema.json', JSON.stringify(schema, null, '\t'))
  logger.info('build success')
}
