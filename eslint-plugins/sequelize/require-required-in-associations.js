/**
 * Require `required: true` or `required: false` to be specified in associations.
 * Reason: avoid accidental mistakes and allow `separate-not-required` rule to be checked.
 *
 * Check is only preformed in `include: [...]` arrays, in objects where `model` is specified.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireRequiredInAssociationsRule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    docs: {
      description: 'Keep in mind, that `require` is implicitly `true` when `where` is set'
    },
    messages: {
      requireRequiredInAssociation: 'Missing `required` field in association',
      requireRequiredTrueInAssociationWithWhere: 'Must use `required: true` when `where` is specified in association'
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const isInIncludeArray = node.parent.type === 'ArrayExpression'
          && node.parent.parent.type === 'Property'
          && node.parent.parent.key.type === 'Identifier'
          && node.parent.parent.key.name === 'include'
        if (!isInIncludeArray) return;

        const modelProperty = node.properties.find(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'model');
        if (!modelProperty) return;

        const hasRequired = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'required');
        if (!hasRequired) {
          const hasWhere = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'where');

          const indent = ' '.repeat(modelProperty.loc.start.column)
          const suggestion = hasWhere ? `,\n${indent}required: true` : `,\n${indent}required: false`
          const fix = (fixer) => fixer.insertTextAfter(modelProperty, suggestion);

          context.report({
            node,
            messageId: 'requireRequiredInAssociation',
            suggest: [
              { desc: hasWhere ? 'Add `required: true`' : 'Add `required: false`', fix }
            ],
            fix,
          });
        }
      },
    };
  },
};
