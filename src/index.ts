import hyperscript from 'hyperscript'
// Expose logic for building image URLs from an image reference/node
export {default as getImageUrl} from './getImageUrl'
import blocksToNodes from './blocksToNodes'
import getSerializers from './serializers'

type RenderNodeFunction = (serializers: any, props: any, children: any) => any

// Expose node renderer
export const renderNode: RenderNodeFunction = (serializer, props = {}, children) => {
  if (typeof serializer === 'function') {
    return serializer({...props, children})
  }

  return hyperscript(serializer, props, props.children ?? children)
}

const {defaultSerializers, serializeSpan} = getSerializers(renderNode, {useDashedStyles: true})
// Expose default serializers to the user
export {defaultSerializers}

function blockContentToHyperscript(options) {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

export default blockContentToHyperscript
