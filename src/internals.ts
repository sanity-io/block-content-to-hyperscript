import getSerializers from './serializers'
export {default as getSerializers} from './serializers'
import {blocksToNodes as _blocksToNodes} from './blocksToNodes'
import {getImageUrl} from './getImageUrl'
export {getImageUrl} from './getImageUrl'
import {mergeSerializers} from './mergeSerializers'
export {mergeSerializers} from './mergeSerializers'

export function blocksToNodes(renderNode, props, defaultSerializers, serializeSpan) {
  if (defaultSerializers) {
    return _blocksToNodes(renderNode, props, defaultSerializers, serializeSpan)
  }

  // Backwards-compatibility
  const serializers = getSerializers(renderNode)
  return _blocksToNodes(renderNode, props, serializers.defaultSerializers, serializers.serializeSpan)
}
