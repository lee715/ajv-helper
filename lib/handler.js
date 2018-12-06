const Parser = require('./parser')

const ap = new Parser()
ap.addKeyword('host', {
  type: 'string',
  format: 'url'
}, function (str) {
  return /hosts?$|urls?$/i.test(str)
})
ap.addKeyword('avatar', {
  type: 'string',
  format: 'url'
}, function (str) {
  return /avatars?$|logos?$/i.test(str)
})
ap.addKeyword('client_id', {
  type: 'string',
  format: 'uuid'
}, function (str) {
  return /client(_id|id|_secret|secret)/i.test(str)
})
ap.addKeyword('id', {
  type: 'string',
  format: 'mongoid'
}, function (str) {
  return /ids?$/i.test(str)
})
ap.addKeyword('email', {
  type: 'string',
  format: 'email'
}, function (str) {
  return /emails?$/i.test(str)
})

module.exports = ap
