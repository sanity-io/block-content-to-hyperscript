const objectAssign = require('object-assign')
const isDefined = val => typeof val !== 'undefined'

// Recursively merge/replace default serializers with user-specified serializers
module.exports = function mergeSerializers(defaultSerializers, userSerializers) {
  return Object.keys(defaultSerializers).reduce((acc, key) => {
    const type = typeof defaultSerializers[key]
    if (type === 'function') {
      acc[key] = isDefined(userSerializers[key]) ? userSerializers[key] : defaultSerializers[key]
    } else if (type === 'object') {
      acc[key] = objectAssign({}, defaultSerializers[key], userSerializers[key])
    } else {
      acc[key] =
        typeof userSerializers[key] === 'undefined' ? defaultSerializers[key] : userSerializers[key]
    }
    return acc
  }, {})
}
