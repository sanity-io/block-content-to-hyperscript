import getSerializers from 'serializers'
import _blocksToNodes, {BlocksToNodesFn} from 'blocksToNodes'

export {default as getImageUrl} from 'getImageUrl'
export {default as mergeSerializers} from 'mergeSerializers'
export {getSerializers}

export const blocksToNodes: BlocksToNodesFn = (
  renderNode,
  props,
  defaultSerializers,
  serializeSpan
) => {
  if (defaultSerializers) {
    return _blocksToNodes(renderNode, props, defaultSerializers, serializeSpan)
  }

  // Backwards-compatibility
  const serializers = getSerializers(renderNode)
  return blocksToNodes(renderNode, props, serializers.defaultSerializers, serializers.serializeSpan)
}
