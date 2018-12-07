const assert = require('assert')
const fs = require('fs')
const Ajv = require('ajv')
const ajv = new Ajv()
const {build} = require('../lib/command')

describe('COMMAND', function () {
  describe('build', function () {
    it('dafault', function () {
      writeJson({
        selfEmail: 'xxx',
        mainHost: 'xxx',
        port: 8000,
        defaultAvatar: 'xxx',
        redis: {
          host: 'xxx'
        },
        whiteHosts: ['xxx', 'xxx']
      })
      build({output: './test/ajvp.json'})
      const schema = JSON.parse(fs.readFileSync('./test/ajvp.json'))
      assert.ok(jsonEqual(schema.properties.selfEmail, {
        type: 'string',
        format: 'email'
      }))
      assert.ok(jsonEqual(schema.properties.mainHost, {
        type: 'string',
        format: 'url'
      }))
      assert.ok(jsonEqual(schema.properties.defaultAvatar, {
        type: 'string',
        format: 'url'
      }))
      assert.ok(jsonEqual(schema.properties.redis, {
        type: 'object',
        properties: {
          host: {
            type: 'string',
            format: 'url'
          }
        },
        required: ['host']
      }))
      assert.ok(jsonEqual(schema.properties.whiteHosts, {
        type: 'array',
        items: {
          type: 'string',
          format: 'url'
        }
      }))
      const valiate = ajv.compile(schema)
      assert.ok(!valiate({
        selfEmail: 'test@test.com'
      }))
      assert.ok(!valiate({
        selfEmail: 'xxxx'
      }))
      assert.ok(valiate({
        selfEmail: 'test@test.com',
        mainHost: 'http://test.com',
        port: 8000,
        defaultAvatar: 'http://test.com/a.jpg',
        redis: {
          host: 'http://test.com'
        },
        whiteHosts: ['http://test.com', 'http://test.com']
      }))
      fs.unlinkSync('./test/ajvp.json')
    })

    it('-c --config', function () {
      build({
        output: './test/ajvp.json',
        config: './test/test.json'
      })
      const schema = JSON.parse(fs.readFileSync('./test/ajvp.json'))
      assert.ok(
        jsonEqual(
          schema.properties.myemail, {
            type: 'string',
            format: 'email'
          }
        )
      )
      const valiate = ajv.compile(schema)
      assert.ok(!valiate({
        myemail1: 'test@test.com'
      }))
      assert.ok(valiate({
        myemail: 'test@test.com'
      }))
      fs.unlinkSync('./test/ajvp.json')
    })
  })
})

function jsonEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function writeJson (jsonObj) {
  fs.writeFileSync(
    './config/default.json',
    JSON.stringify(jsonObj, null, '\t')
  )
}
