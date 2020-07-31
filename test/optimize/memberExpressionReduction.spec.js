const test = require('ava')
const AbstractSyntaxTree = require('../..')
const memberExpressionReduction = require('../../src/optimize/memberExpressionReduction')

test('memberExpressionReduction', assert => {
  var tree = new AbstractSyntaxTree('const foo = ({ bar: "baz" }).bar\n')
  tree.replace({ enter: memberExpressionReduction })
  assert.deepEqual(tree.source, 'const foo = "baz";\n')

  var tree = new AbstractSyntaxTree('const foo = "bar"; const bar = ({ foo }).foo\n')
  tree.replace({ enter: memberExpressionReduction })
  assert.deepEqual(tree.source, 'const foo = "bar";\nconst bar = ({\n  foo\n}).foo;\n')
})