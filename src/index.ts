import hyperscript from 'hyperscript'
import objectAssign from 'object-assign'
import {getImageUrl} from './getImageUrl'
import {blocksToNodes} from './blocksToNodes'
import getSerializers from './serializers'

const renderNode = (serializer, properties, children) => {
  const props = properties || {}
  if (typeof serializer === 'function') {
    return serializer(objectAssign({}, props, {children}))
  }

  const tag = serializer
  const childNodes = props.children || children
  return hyperscript(tag, props, childNodes)
}

const {defaultSerializers, serializeSpan} = getSerializers(renderNode, {useDashedStyles: true})

const blockContentToHyperscript = options => {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

// Expose default serializers to the user
blockContentToHyperscript.defaultSerializers = defaultSerializers

// Expose logic for building image URLs from an image reference/node
blockContentToHyperscript.getImageUrl = getImageUrl

// Expose node renderer
blockContentToHyperscript.renderNode = renderNode

export default blockContentToHyperscript
