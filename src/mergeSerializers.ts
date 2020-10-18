import {defaultSerializers as _defaultSerializers} from 'blockContentToHyperscript'
import {MergeSerializersFn} from './types'

function isDefined(val) {
  return typeof val !== 'undefined'
}

// Recursively merge/replace default serializers with user-specified serializers
const mergeSerializers: MergeSerializersFn = (defaultSerializers = {}, userSerializers = {}) => {
  return Object.keys(defaultSerializers).reduce((acc, key) => {
    const type = typeof defaultSerializers[key]
    if (type === 'function') {
      acc[key] = isDefined(userSerializers[key]) ? userSerializers[key] : defaultSerializers[key]
    } else if (type === 'object') {
      acc[key] = {...defaultSerializers[key], ...userSerializers[key]}
    } else {
      acc[key] =
        typeof userSerializers[key] === 'undefined' ? defaultSerializers[key] : userSerializers[key]
    }
    return acc
  }, _defaultSerializers)
}

export default mergeSerializers
