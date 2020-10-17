import hyperscript from 'hyperscript'
// Expose logic for building image URLs from an image reference/node
export * from 'getImageUrl'
export {default as getImageUrl} from 'getImageUrl'
export * from 'mergeSerializers'
export {default as mergeSerializers} from 'mergeSerializers'
import blocksToNodes, {BlocksToNodesFn} from 'blocksToNodes'
import getSerializers, {Serializers} from 'serializers'
export {getSerializers}
export type {Serializers, BlocksToNodesFn}

export type RenderNodeFn = (serializers: any, props: any, children: any) => any

// Expose node renderer

export const renderNode: RenderNodeFn = (serializer, properties, children) => {
  const props = properties || {}
  if (typeof serializer === 'function') {
    return serializer({...props, children})
  }

  const tag = serializer
  const childNodes = props.children || children
  return hyperscript(tag, props, childNodes)
}

const {defaultSerializers, serializeSpan} = getSerializers(renderNode, {useDashedStyles: true})
// Expose default serializers to the user
export {defaultSerializers}

export {blocksToNodes}

function blockContentToHyperscript(options: any) {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

export default blockContentToHyperscript
