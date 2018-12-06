function isPureObject (obj) {
  return typeof obj === 'object' && !Array.isArray(obj)
}

class AjvParser {
  constructor () {
    this.handlers = {}
    this.keywords = []
    return this
  }

  use (keywords) {
    this.keywords = keywords
  }

  addKeyword (keyword, schema, matchFn) {
    if (!matchFn) {
      matchFn = function (str) {
        const reg = new RegExp(keyword)
        return reg.test(str)
      }
    }
    this.handlers[keyword] = [keyword, schema, matchFn]
    this.keywords.push(keyword)
  }

  parse (conf) {
    this.schema = {
      type: 'object',
      properties: {}
    }
    return this._parse(conf, this.schema.properties)
  }

  // 处理数组、字符串、数字、布尔值等情况
  handleDefault (key, conf, schema) {
    if (Array.isArray(conf)) {
      schema[key] = {
        type: 'array',
        items: {}
      }
      if (typeof conf[0] === 'object' && !Array.isArray(conf[0])) {
        this._parse(conf[0], schema[key]['items'])
      } else {
        this.handleDefault('items', conf[0], schema[key])
      }
    } else if (typeof conf === 'string') {
      schema[key] = {
        type: 'string'
      }
    } else if (typeof conf === 'number') {
      schema[key] = {
        type: 'number'
      }
    } else if (typeof conf === 'boolean') {
      schema[key] = {
        type: 'boolean'
      }
    }
  }

  _parse (conf, schema) {
    let keys = Object.keys(conf)
    for (let key of keys) {
      let handled = false
      // 先按关键字处理
      for (let hdlkey of this.keywords) {
        let [keyword, scm, maFn] = this.handlers[hdlkey]
        if (maFn(key)) {
          handle(key, scm, schema)
          handled = true
          break
        }
      }
      if (handled) continue
      // 关键字未匹配，则按默认行为处理:对象递归，其他则调用默认处理器
      if (isPureObject(conf[key])) {
        schema[key] = {
          type: 'object',
          properties: {}
        }
        this._parse(conf[key], schema[key]['properties'])
      } else {
        this.handleDefault(key, conf[key], schema)
      }
    }
    return schema

    function handle (key, scm, schema) {
      if (Array.isArray(conf[key])) {
        schema[key] = {
          type: 'array',
          items: scm
        }
      } else if (typeof conf[key] === 'object') {
        schema[key] = {}
        let obKeys = Object.keys(conf[key])
        for (let obKey of obKeys) {
          schema[key][obKey] = scm
        }
      } else if (typeof conf[key] === 'string') {
        schema[key] = scm
      }
    }
  }
}

module.exports = AjvParser
