/**
 * Requires `tableName` and `underscored: true` to be specified in `@Table()`.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateTableDefinition = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireTableNameInTable: 'Missing `tableName` field in @Table() decorator',
      requireUnderscoredInTable: 'Missing `underscored: true` field in @Table() decorator',
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const isInTableDecorator = node.parent.type === 'CallExpression'
          && node.parent.callee.type === 'Identifier'
          && node.parent.callee.name === 'Table'
        if (!isInTableDecorator) return;

        const hasTableName = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'tableName')
        if (!hasTableName) {
          context.report({ node, messageId: 'requireTableNameInTable' });
        }

        const hasUnderscoredTrue = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'underscored' && p.value.value === true)
        if (!hasUnderscoredTrue) {
          context.report({ node, messageId: 'requireUnderscoredInTable' });
        }
      },
    };
  },
};
