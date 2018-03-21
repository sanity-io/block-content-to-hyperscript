const hyperscript = require('hyperscript')
const objectAssign = require('object-assign')
const getImageUrl = require('./getImageUrl')
const blocksToNodes = require('./blocksToNodes')
const getSerializers = require('./serializers')

const renderNode = (serializer, properties, children) => {
  const props = properties || {}
  if (typeof serializer === 'function') {
    return serializer(objectAssign({}, props, {children}))
  }

  const tag = serializer
  const childNodes = props.children || children
  return hyperscript(tag, props, childNodes)
}

const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

const blockContentToHyperscript = options => {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

// Expose default serializers to the user
blockContentToHyperscript.defaultSerializers = defaultSerializers

// Expose logic for building image URLs from an image reference/node
blockContentToHyperscript.getImageUrl = getImageUrl

// Expose node renderer
blockContentToHyperscript.renderNode = renderNode

module.exports = blockContentToHyperscript
