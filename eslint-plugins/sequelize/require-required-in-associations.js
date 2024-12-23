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
    schema: [],
    docs: {
      description: 'Keep in mind, that associations with `where` clause have `required: true` by default'
    },
    messages: {
      requireRequiredInAssociation: 'Explicitly add `{{suggestion}}` to the association'
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

        const hasModel = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'model');
        if (!hasModel) return;

        const hasRequired = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'required');
        if (!hasRequired) {
          const hasWhere = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'where');
          const suggestion = hasWhere ? 'required: true' : 'required: false';

          context.report({
            node,
            messageId: 'requireRequiredInAssociation',
            data: {
              suggestion,
            },
            fix(fixer) {
              const lastProperty = node.properties[node.properties.length - 1];
              const comma = context.sourceCode.getText(lastProperty).endsWith(',') ? ' ' : ', ';

              return fixer.insertTextAfter(lastProperty, comma + suggestion);
            }
          });
        }
      },
    };
  },
};
