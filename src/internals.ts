const getSerializers = require('./serializers')
const blocksToNodes = require('./blocksToNodes')
const getImageUrl = require('./getImageUrl')
const mergeSerializers = require('./mergeSerializers')

module.exports = {
  blocksToNodes: (renderNode, props, defaultSerializers, serializeSpan) => {
    if (defaultSerializers) {
      return blocksToNodes(renderNode, props, defaultSerializers, serializeSpan)
    }

    // Backwards-compatibility
    const serializers = getSerializers(renderNode)
    return blocksToNodes(
      renderNode,
      props,
      serializers.defaultSerializers,
      serializers.serializeSpan
    )
  },
  getSerializers,
  getImageUrl,
  mergeSerializers
}
