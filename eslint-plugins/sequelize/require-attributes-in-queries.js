/**
 * Require `attributes: [...]` to be specified in `findAll()` or `findOne()` methods and in associations.
 * Reason: avoid unnecessarily fetching all columns.
 *
 * Check is only preformed:
 * - In `findAll()` and `findOne()` methods
 * - In `include: [...]` arrays, in objects where `model` is specified.
*
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireAttributesInQueriesRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireAttributesInFindMethod: 'Missing `attributes` field in findAll() or findOne() method',
      requireAttributesInAssociation: 'Missing `attributes` field in association',
    },
  },
  create(context) {
    return {
      // In method calls
      CallExpression(node) {
        const isFindMethod = node.callee.type === 'MemberExpression'
          && node.callee.property.type === 'Identifier'
          && ['findAll', 'findOne'].includes(node.callee.property.name)
        if (!isFindMethod) return;

        const [options] = node.arguments;
        if (options.type !== 'ObjectExpression') return;

        const hasAttributes = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'attributes');
        if (hasAttributes) return;

        context.report({ node, messageId: 'requireAttributesInFindMethod' });
      },
      // In objects
      ObjectExpression(node) {
        const isInIncludeArray = node.parent.type === 'ArrayExpression'
          && node.parent.parent.type === 'Property'
          && node.parent.parent.key.type === 'Identifier'
          && node.parent.parent.key.name === 'include'
        if (!isInIncludeArray) return;

        const hasModel = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'model');
        if (!hasModel) return;

        const hasAttributes = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'attributes');
        if (hasAttributes) return;

        context.report({ node, messageId: 'requireAttributesInAssociation' });
      },
    };
  },
};
