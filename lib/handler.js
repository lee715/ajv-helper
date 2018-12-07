const Parser = require('./parser')

const ap = new Parser()
ap.addKeyword('host', {
  type: 'string',
  format: 'url'
}, function (str) {
  return /hosts?$|urls?$|uris?$/i.test(str)
})
ap.addKeyword('avatar', {
  type: 'string',
  format: 'url'
}, function (str) {
  return /avatars?$|logos?$/i.test(str)
})
ap.addKeyword('email', {
  type: 'string',
  format: 'email'
}, function (str) {
  return /emails?$/i.test(str)
})

module.exports = ap
