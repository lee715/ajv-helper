#!/usr/bin/env node

const program = require('commander')
const { build } = require('./command.js')
const pkg = require('../package')

program.version(pkg.version)
  .usage('<command>')

program.command('build')
  .alias('b')
  .description('Build a ajv schema json file')
  .option('-o, --output <output>', 'the output location of ajv schema json file, default to ./ajvp.json')
  .option('-i, --input <input>', 'the file of custom instance of AjvParser')
  .option('-c, --config <config>', 'the config.json file to parse, default to use the result of require("config")')
  .action(build)

program.parse(process.argv)
