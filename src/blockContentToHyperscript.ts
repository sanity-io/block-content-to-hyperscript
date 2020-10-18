import hyperscript from 'hyperscript'
import blocksToNodes from 'blocksToNodes'
import getSerializers from 'serializers'
import {RenderNodeFn} from './types'

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

export {defaultSerializers}

export default function blockContentToHyperscript(options: any) {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}
