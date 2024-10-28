/**
 * Require `limit` to be specified in `findAll()` method.
 * Reason: avoid accidentally fetching a lot of rows.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireLimitInFindAllRule = {
  meta: {
    type: 'problem',
    schema: [],
    docs: {
      description: 'Keep in mind, that setting `limit` automatically sets `subQuery: true`'
    },
    messages: {
      requireLimitInFindAll: 'Consider adding `limit` option to the findAll() method',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const isFindMethod = node.callee.type === 'MemberExpression'
          && node.callee.property.type === 'Identifier'
          && node.callee.property.name === 'findAll'
        if (!isFindMethod) return;

        const [options] = node.arguments;
        if (options.type !== 'ObjectExpression') return;

        const hasLimit = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'limit');
        if (hasLimit) return;

        context.report({ node, messageId: 'requireLimitInFindAll' });
      }
    };
  },
};
