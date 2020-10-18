export interface Serializers {
  // Common overrides
  types: {
    block: any
    image: any
  }
  marks: any

  // Less common overrides
  list: any
  listItem: any

  block: any
  span: any
  hardBreak: any

  // Container element
  container: any

  // When we can't resolve the mark properly, use this renderer as the container
  markFallback: any

  // Allow overriding text renderer, but leave undefined to just use plain strings by default
  text?: any

  // Empty nodes (React uses null, hyperscript with empty strings)
  empty: string
}

export type BlocksToNodesFn = (
  renderNode: any,
  props: any,
  defaultSerializers?: Serializers,
  serializeSpan?: any
) => any

export interface MarkNode {
  _type: string // REVIEW: Can we add stricter typing here?
  children: any[]
  markKey?: string
}

export type RenderNodeFn = (serializers: any, props: any, children: any) => any

export type MergeSerializersFn = (
  defaultSerializers?: Partial<Serializers>,
  userSerializers?: Partial<Serializers>
) => Serializers
