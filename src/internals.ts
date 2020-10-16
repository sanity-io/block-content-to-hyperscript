import getSerializers from 'serializers'
import _blocksToNodes from 'blocksToNodes'

export {default as getImageUrl} from 'getImageUrl'
export {default as mergeSerializers} from 'mergeSerializers'
export {getSerializers}

export function blocksToNodes(renderNode, props, defaultSerializers, serializeSpan) {
  if (defaultSerializers) {
    return _blocksToNodes(renderNode, props, defaultSerializers, serializeSpan)
  }

  // Backwards-compatibility
  const serializers = getSerializers(renderNode)
  return blocksToNodes(renderNode, props, serializers.defaultSerializers, serializers.serializeSpan)
}
