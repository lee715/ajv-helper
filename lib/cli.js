#!/usr/bin/env node

const program = require('commander')
const { build } = require('./command.js')
const pkg = require('../package')

program.version(pkg.version)
  .usage('<command>')

program.command('build')
  .alias('b')
  .description('Build an image from a Dockerfile')
  .option('-o, --output <output>', 'the output location of ajv schema json file')
  .action(build)

program.parse(process.argv)
