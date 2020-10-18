import buildMarksTree from 'buildMarksTree'
import nestLists from 'nestLists'
import generateKeys from 'generateKeys'
import mergeSerializers from 'mergeSerializers'
import {BlocksToNodesFn} from './types'

// Properties to extract from props and pass to serializers as options
const optionProps = ['projectId', 'dataset', 'imageOptions']
const isDefined = (val) => typeof val !== 'undefined'
const defaults = {imageOptions: {}}

const blocksToNodes: BlocksToNodesFn = (h, properties, defaultSerializers, serializeSpan) => {
  const props = {...defaults, ...properties}
  const rawBlocks = Array.isArray(props.blocks) ? props.blocks : [props.blocks]
  const keyedBlocks = generateKeys(rawBlocks)
  const blocks = nestLists(keyedBlocks, props.listNestMode)
  const serializers = mergeSerializers(defaultSerializers, props.serializers || {})

  const options = optionProps.reduce((opts, key) => {
    const value = props[key]
    if (isDefined(value)) {
      opts[key] = value
    }
    return opts
  }, {})

  function serializeNode(node, index, siblings, isInline?: boolean) {
    if (isList(node)) {
      return serializeList(node)
    }

    if (isListItem(node)) {
      return serializeListItem(node, findListItemIndex(node, siblings))
    }

    if (isSpan(node)) {
      return serializeSpan(node, serializers, index, {serializeNode})
    }

    return serializeBlock(node, index, isInline)
  }

  function findListItemIndex(node, siblings) {
    let index = 0
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === node) {
        return index
      }

      if (!isListItem(siblings[i])) {
        continue
      }

      index++
    }

    return index
  }

  function serializeBlock(block, index, isInline) {
    const tree = buildMarksTree(block)
    const children = tree.map((node, i, siblings) => serializeNode(node, i, siblings, true))
    const blockProps = {
      key: block._key || `block-${index}`,
      node: block,
      isInline,
      serializers,
      options
    }

    return h(serializers.block, blockProps, children)
  }

  function serializeListItem(block, index) {
    const key = block._key
    const tree = buildMarksTree(block)
    const children = tree.map(serializeNode)
    return h(serializers.listItem, {node: block, serializers, index, key, options}, children)
  }

  function serializeList(list) {
    const type = list.listItem
    const level = list.level
    const key = list._key
    const children = list.children.map(serializeNode)
    return h(serializers.list, {key, level, type, options}, children)
  }

  // Default to false, so `undefined` will evaluate to the default here
  const renderContainerOnSingleChild = Boolean(props.renderContainerOnSingleChild)

  const nodes = blocks.map(serializeNode)
  if (renderContainerOnSingleChild || nodes.length > 1) {
    const containerProps = props.className ? {className: props.className} : {}
    return h(serializers.container, containerProps, nodes)
  }

  if (nodes[0]) {
    return nodes[0]
  }

  return typeof serializers.empty === 'function' ? h(serializers.empty) : serializers.empty
}

export default blocksToNodes

function isList(block) {
  return block._type === 'list' && block.listItem
}

function isListItem(block) {
  return block._type === 'block' && block.listItem
}

function isSpan(block) {
  return typeof block === 'string' || block.marks || block._type === 'span'
}
