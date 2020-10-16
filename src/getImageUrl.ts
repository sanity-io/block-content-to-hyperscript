import generateHelpUrl from '@sanity/generate-help-url'
import urlBuilder from '@sanity/image-url'

const enc = encodeURIComponent
const materializeError = `You must either:
  - Pass \`projectId\` and \`dataset\` to the block renderer
  - Materialize images to include the \`url\` field.

For more information, see ${generateHelpUrl('block-content-image-materializing')}`

const getQueryString = options => {
  const query = options.imageOptions
  const keys = Object.keys(query)
  if (!keys.length) {
    return ''
  }

  const params = keys.map(key => `${enc(key)}=${enc(query[key])}`)
  return `?${params.join('&')}`
}

export default function buildUrl(props) {
  const {node, options} = props
  const {projectId, dataset} = options
  const asset = node.asset

  if (!asset) {
    throw new Error('Image does not have required `asset` property')
  }

  if (asset.url) {
    return asset.url + getQueryString(options)
  }

  if (!projectId || !dataset) {
    throw new Error(materializeError)
  }

  const ref = asset._ref
  if (!ref) {
    throw new Error('Invalid image reference in block, no `_ref` found on `asset`')
  }

  return urlBuilder({projectId, dataset, ...options.imageOptions})
    .image(node)
    .toString()
}