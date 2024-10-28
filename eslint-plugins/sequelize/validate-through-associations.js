/**
 * 1. Require non-empty `attributes` field in `include[].through`.
 * Reason: empty `attributes` array makes `through` return no results.
 * 
 * 2. Require `as` field in `include[].through`
 * Reason: not specifying it will use PascalCase name for a field instead of a custom one.
 *
 * Check is only preformed in `include: [...]` arrays, in objects where `model` and `through` is specified.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateThroughAssociationsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireThroughAs: 'Missing `through.as` option in the association',
      requireThroughAttributes: 'Missing `through.attributes` option in the association',
      requireThroughAttributesNotEmpty: 'Option `through.attributes` must not be empty in the associations',
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const isInThroughObject = node.parent.type === 'Property' && node.parent.key.type === 'Identifier' && node.parent.key.name === 'through';
        if (!isInThroughObject) return;

        const hasModelSibling = node.parent.parent.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'model')
        if (!hasModelSibling) return;

        const isInIncludeArray = node.parent.parent.parent.type === 'ArrayExpression'
          && node.parent.parent.parent.parent.type === 'Property'
          && node.parent.parent.parent.parent.key.type === 'Identifier'
          && node.parent.parent.parent.parent.key.name === 'include'
        if (!isInIncludeArray) return;

        const hasAs = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'as')
        if (!hasAs) {
          context.report({ node, messageId: 'requireThroughAs' });
        }

        const attributesProperty = node.properties.find(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'attributes')
        if (!attributesProperty) {
          context.report({ node, messageId: 'requireThroughAttributes' });
        } else if (attributesProperty.value.elements.length === 0) {
          context.report({ node, messageId: 'requireThroughAttributesNotEmpty' });
        }
      },
    };
  },
};
