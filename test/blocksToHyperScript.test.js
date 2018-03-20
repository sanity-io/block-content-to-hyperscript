/* eslint-disable id-length, max-len */
const runTests = require('@sanity/block-content-tests')
const blocksToHyperScript = require('../src')
const getSerializers = require('../src/serializers')

const h = blocksToHyperScript.renderNode
const getImageUrl = blocksToHyperScript.getImageUrl
const {defaultSerializers, serializeSpan} = getSerializers(h)
const normalize = html =>
  html
    .replace(/<br(.*?)\/>/g, '<br$1>')
    .replace(/<img(.*?)\/>/g, '<img$1>')
    .replace(/&quot;/g, '"')
    .replace(/&#x(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16))
    })
    .replace(/ style="(.*?)"/g, (match, styleProps) => {
      const style = styleProps.replace(/:(\S)/g, ': $1')
      return ` style="${style}"`
    })

const render = options => {
  const rootNode = blocksToHyperScript(options, defaultSerializers, serializeSpan)
  return rootNode.outerHTML || rootNode
}

runTests({render, h, normalize, getImageUrl, defaultSerializers, serializeSpan})
