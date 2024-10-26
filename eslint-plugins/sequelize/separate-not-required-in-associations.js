/**
 * Do not allow combining `separate: true` and `required: true` in associations.
 * Reason: `separate` splits query into multiple queries, silently ignoring `required: true`.
 * 
 * Check is only preformed in `include: [...]` arrays, in objects where `model` is specified.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const separateNotRequiredInAssociationsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      separateNotRequiredInAssociation: 'Cannot use `required: true` with `separate: true` in association',
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

        const hasRequiredTrue = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'required' && p.value.value === true);
        if (!hasRequiredTrue) return;

        const hasSeparateTrue = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'separate' && p.value.value === true);
        if (!hasSeparateTrue) return;

        context.report({ node, messageId: 'separateNotRequiredInAssociation' });
      },
    };
  },
};
