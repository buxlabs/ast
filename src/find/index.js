const esquery = require('esquery')
const traverse = require('../traverse')
const equal = require('../equal')
const TYPES = require('../../types.json')
const serialize = require('../serialize')
const parse = require('../parse')
const tokenize = require('./tokenize')

function findByType (tree, selector) {
  return findByComparison(tree, { type: selector })
}

function parseSelector (selector) {
  const tokens = tokenize(selector)
  return tokens.reduce((result, current) => {
    if (current.type === 'attribute') {
      const { expression } = parse(current.value).body[0]
      result[current.key] = serialize(expression)
    }
    return result
  }, {})
}

function findByAttribute (tree, selector) {
  return findByComparison(tree, parseSelector(selector))
}

function findByComparison (tree, selector) {
  const nodes = []
  traverse(tree, {
    enter (node) {
      if (equal(node, selector)) {
        nodes.push(node)
      }
    }
  })
  return nodes
}

function findByQuery (tree, selector) {
  return esquery(tree, selector)
}

function findByWildcard (tree) {
  const nodes = []
  traverse(tree, {
    enter (node) {
      nodes.push(node)
    }
  })
  return nodes
}

function isTypeSelector (selector) {
  return TYPES.includes(selector)
}

function isAttributeSelector (selector) {
  return isQuerySelector(selector) && selector.startsWith('[') && selector.endsWith(']')
}

function isWildcardSelector (selector) {
  return selector === '*'
}

function isQuerySelector (selector) {
  return typeof selector === 'string'
}

module.exports = function find (tree, selector) {
  if (isTypeSelector(selector)) {
    return findByType(tree, selector)
  }
  if (isAttributeSelector(selector)) {
    return findByAttribute(tree, selector)
  }
  if (isWildcardSelector(selector)) {
    return findByWildcard(tree)
  }
  if (isQuerySelector(selector)) {
    return findByQuery(tree, selector)
  }
  return findByComparison(tree, selector)
}