import getImageUrl from 'getImageUrl'

export default function serializers(h, serializerOpts?: any) {
  const serializeOptions = serializerOpts || {useDashedStyles: false}

  // Low-level block serializer
  function BlockSerializer(props) {
    const {node, serializers: _serializers, options, isInline, children} = props
    const blockType = node._type
    const serializer = _serializers.types[blockType]
    if (!serializer) {
      throw new Error(
        `Unknown block type "${blockType}", please specify a serializer for it in the \`serializers.types\` prop`
      )
    }

    return h(serializer, {node, options, isInline}, children)
  }

  // Low-level span serializer
  function SpanSerializer(props) {
    const {mark, children} = props.node
    const isPlain = typeof mark === 'string'
    const markType = isPlain ? mark : mark._type
    const serializer = props.serializers.marks[markType]
    if (!serializer) {
      // @todo Revert back to throwing errors?
      // eslint-disable-next-line no-console
      console.warn(
        `Unknown mark type "${markType}", please specify a serializer for it in the \`serializers.marks\` prop`
      )
      return h(props.serializers.markFallback, null, children)
    }

    return h(serializer, props.node, children)
  }

  // Low-level list serializer
  function ListSerializer(props) {
    const tag = props.type === 'bullet' ? 'ul' : 'ol'
    return h(tag, null, props.children)
  }

  // Low-level list item serializer
  function ListItemSerializer(props) {
    const children =
      !props.node.style || props.node.style === 'normal'
        ? // Don't wrap plain text in paragraphs inside of a list item
          props.children
        : // But wrap any other style in whatever the block serializer says to use
          h(props.serializers.types.block, props, props.children)

    return h('li', null, children)
  }

  // Renderer of an actual block of type `block`. Confusing, we know.
  function BlockTypeSerializer(props) {
    const style = props.node.style || 'normal'

    if (/^h\d/.test(style)) {
      return h(style, null, props.children)
    }

    return style === 'blockquote'
      ? h('blockquote', null, props.children)
      : h('p', null, props.children)
  }

  // Serializers for things that can be directly attributed to a tag without any props
  // We use partial application to do this, passing the tag name as the first argument
  function RawMarkSerializer(tag, props) {
    return h(tag, null, props.children)
  }

  function UnderlineSerializer(props) {
    const style = serializeOptions.useDashedStyles
      ? {'text-decoration': 'underline'}
      : {textDecoration: 'underline'}

    return h('span', {style}, props.children)
  }

  function StrikeThroughSerializer(props) {
    return h('del', null, props.children)
  }

  function LinkSerializer(props) {
    return h('a', {href: props.mark.href}, props.children)
  }

  function ImageSerializer(props) {
    if (!props.node.asset) {
      return null
    }

    const img = h('img', {src: getImageUrl(props)})
    return props.isInline ? img : h('figure', null, img)
  }

  // Serializer that recursively calls itself, producing a hyperscript tree of spans
  function serializeSpan(span, _serializers, index, options?: any) {
    if (span === '\n' && _serializers.hardBreak) {
      return h(_serializers.hardBreak, {key: `hb-${index}`})
    }

    if (typeof span === 'string') {
      return _serializers.text ? h(_serializers.text, {key: `text-${index}`}, span) : span
    }

    let children
    if (span.children) {
      children = {
        children: span.children.map((child, i) =>
          options.serializeNode(child, i, span.children, true)
        ),
      }
    }

    const serializedNode = {...span, ...children}

    return h(_serializers.span, {
      key: span._key || `span-${index}`,
      node: serializedNode,
      serializers: _serializers,
    })
  }

  const HardBreakSerializer = () => h('br')
  const defaultMarkSerializers = {
    strong: RawMarkSerializer.bind(null, 'strong'),
    em: RawMarkSerializer.bind(null, 'em'),
    code: RawMarkSerializer.bind(null, 'code'),
    underline: UnderlineSerializer,
    'strike-through': StrikeThroughSerializer,
    link: LinkSerializer
  }

  const defaultSerializers = {
    // Common overrides
    types: {
      block: BlockTypeSerializer,
      image: ImageSerializer
    },
    marks: defaultMarkSerializers,

    // Less common overrides
    list: ListSerializer,
    listItem: ListItemSerializer,

    block: BlockSerializer,
    span: SpanSerializer,
    hardBreak: HardBreakSerializer,

    // Container element
    container: 'div',

    // When we can't resolve the mark properly, use this renderer as the container
    markFallback: 'span',

    // Allow overriding text renderer, but leave undefined to just use plain strings by default
    text: undefined,

    // Empty nodes (React uses null, hyperscript with empty strings)
    empty: ''
  }

  return {
    defaultSerializers,
    serializeSpan
  }
}
