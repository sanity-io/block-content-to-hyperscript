import hyperscript from 'hyperscript'
import getImageUrl from './getImageUrl'
import blocksToNodes from './blocksToNodes'
import getSerializers from './serializers'

const renderNode = (serializer, properties, children) => {
  const props = properties || {}
  if (typeof serializer === 'function') {
    return serializer({...props, children})
  }

  const tag = serializer
  const childNodes = props.children || children
  return hyperscript(tag, props, childNodes)
}

const {defaultSerializers, serializeSpan} = getSerializers(renderNode, {useDashedStyles: true})

const blockContentToHyperscript = options => {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

export default blockContentToHyperscript

export {
  // Expose default serializers to the user
  defaultSerializers,
  // Expose logic for building image URLs from an image reference/node
  getImageUrl,
  // Expose node renderer
  renderNode
}
