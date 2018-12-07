const fs = require('fs')
const url = require('url')
const logger = require('graceful-logger')
const defaultParser = require('./handler')

exports.build = (cmd, opts) => {
  logger.info('build start')
  const pwd = process.env.PWD + '/'
  let {output, input, config} = cmd

  logger.info('read config')
  let confObj
  if (config) {
    confObj = readJsonConfig(
      url.resolve(pwd, config)
    )
  } else {
    confObj = readNodeConfig(pwd)
  }
  if (!confObj) {
    logger.info('read config failed')
    return
  }

  logger.info('read parser')
  let parser
  let parserDir = url.resolve(pwd, input || './ajv-parser.js')
  if (fs.existsSync(parserDir)) {
    parser = require(parserDir)
  } else {
    parser = defaultParser
  }

  logger.info('start parse')
  let schema = parser.parse(confObj)

  logger.info('start output')
  output = url.resolve(pwd, output || './ajvp.json')
  fs.writeFileSync(output, JSON.stringify(schema, null, '\t'))
  logger.info('build success')
}

function readNodeConfig (pwd) {
  let confDir = url.resolve(pwd, './___ajv_config___.js')
  fs.writeFileSync(
    confDir,
    'module.exports = require("config")'
  )
  let confObj = null
  try {
    confObj = require(confDir)
  } catch (e) {
    logger.error(e)
  }
  fs.unlinkSync(confDir)
  return confObj
}

function readJsonConfig (dir) {
  let confObj = null
  try {
    confObj = require(dir)
  } catch (e) {
    logger.error(e)
  }
  return confObj
}
