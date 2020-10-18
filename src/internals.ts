import getSerializers from 'serializers'
import _blocksToNodes from 'blocksToNodes'
import {BlocksToNodesFn} from './types'

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
