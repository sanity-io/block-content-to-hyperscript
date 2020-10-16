const defaultMarks = ['strong', 'em', 'code', 'underline', 'strike-through']

export default function buildMarksTree(block) {
  const {children, markDefs} = block
  if (!children || !children.length) {
    return []
  }

  const sortedMarks = children.map(sortMarksByOccurences)
  const rootNode = {_type: 'span', children: []}
  let nodeStack = [rootNode]

  children.forEach((span, i) => {
    const marksNeeded = sortedMarks[i]
    if (!marksNeeded) {
      const lastNode = nodeStack[nodeStack.length - 1]
      lastNode.children.push(span)
      return
    }

    let pos = 1

    // Start at position one. Root is always plain and should never be removed. (?)
    if (nodeStack.length > 1) {
      for (pos; pos < nodeStack.length; pos++) {
        const mark = nodeStack[pos].markKey
        const index = marksNeeded.indexOf(mark)
        // eslint-disable-next-line max-depth
        if (index === -1) {
          break
        }

        marksNeeded.splice(index, 1)
      }
    }

    // Keep from beginning to first miss
    nodeStack = nodeStack.slice(0, pos)

    // Add needed nodes
    let currentNode = findLastParentNode(nodeStack)
    marksNeeded.forEach((mark) => {
      const node = {
        _type: 'span',
        _key: span._key,
        children: [],
        mark: markDefs.find((def) => def._key === mark) || mark,
        markKey: mark,
      }

      currentNode.children.push(node)
      nodeStack.push(node)
      currentNode = node
    })

    // Split at newlines to make individual line chunks, but keep newline
    // characters as individual elements in the array. We use these characters
    // in the span serializer to trigger hard-break rendering
    if (isTextSpan(span)) {
      const lines = span.text.split('\n')
      for (let line = lines.length; line-- > 1; ) {
        lines.splice(line, 0, '\n')
      }

      currentNode.children = currentNode.children.concat(lines)
    } else {
      currentNode.children = currentNode.children.concat(span)
    }
  })

  return rootNode.children
}

// We want to sort all the marks of all the spans in the following order:
// 1. Marks that are shared amongst the most adjacent siblings
// 2. Non-default marks (links, custom metadata)
// 3. Built-in, plain marks (bold, emphasis, code etc)
function sortMarksByOccurences(span, i, spans) {
  if (!span.marks || span.marks.length === 0) {
    return span.marks || []
  }

  const markOccurences = span.marks.reduce((occurences, mark) => {
    occurences[mark] = occurences[mark] ? occurences[mark] + 1 : 1

    for (let siblingIndex = i + 1; siblingIndex < spans.length; siblingIndex++) {
      const sibling = spans[siblingIndex]

      if (sibling.marks && Array.isArray(sibling.marks) && sibling.marks.indexOf(mark) !== -1) {
        occurences[mark]++
      } else {
        break
      }
    }

    return occurences
  }, {})

  const sortByOccurence = sortMarks.bind(null, markOccurences)

  // Slicing because sort() mutates the input
  return span.marks.slice().sort(sortByOccurence)
}

function sortMarks(occurences, markA, markB) {
  const aOccurences = occurences[markA] || 0
  const bOccurences = occurences[markB] || 0

  if (aOccurences !== bOccurences) {
    return bOccurences - aOccurences
  }

  const aDefaultPos = defaultMarks.indexOf(markA)
  const bDefaultPos = defaultMarks.indexOf(markB)

  // Sort default marks last
  if (aDefaultPos !== bDefaultPos) {
    return aDefaultPos - bDefaultPos
  }

  // Sort other marks simply by key
  if (markA < markB) {
    return -1
  } else if (markA > markB) {
    return 1
  }

  return 0
}

function isTextSpan(node) {
  return (
    node._type === 'span' &&
    typeof node.text === 'string' &&
    (Array.isArray(node.marks) || typeof node.marks === 'undefined')
  )
}

function findLastParentNode(nodes) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node._type === 'span' && node.children) {
      return node
    }
  }

  return undefined
}
