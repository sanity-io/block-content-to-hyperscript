import hyperscript from 'hyperscript'
// Expose logic for building image URLs from an image reference/node
export {default as getImageUrl} from 'getImageUrl'
import blocksToNodes from 'blocksToNodes'
import getSerializers from 'serializers'

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

function blockContentToHyperscript(options) {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

export default blockContentToHyperscript
