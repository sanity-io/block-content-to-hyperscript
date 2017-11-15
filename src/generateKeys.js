const objectAssign = require('object-assign')

module.exports = blocks => {
  return blocks.map(block => {
    if (block._key) {
      return block
    }

    return objectAssign({_key: getStaticKey(block)}, block)
  })
}

function getStaticKey(item) {
  return checksum(JSON.stringify(item))
    .toString(36)
    .replace(/[^A-Za-z0-9]/g, '')
}

/* eslint-disable no-bitwise */
function checksum(str) {
  let hash = 0
  const strlen = str.length
  if (strlen === 0) {
    return hash
  }

  for (let i = 0; i < strlen; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash &= hash // Convert to 32bit integer
  }

  return hash
}
/* eslint-enable no-bitwise */
