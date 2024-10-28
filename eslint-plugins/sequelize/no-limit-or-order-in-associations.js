/**
 * Do not allow using `limit` or `order` in associations unless `separate: true` is set.
 * Reason: `order` is completely ignored by Sequelize, while `limit` produces invalid query.
 * 
 * Check is only preformed in `include: [...]` arrays, in objects where `model` is specified.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const noLimitOrOrderInAssociationsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noLimitOrOrderInAssociation: 'Option `{{option}}` is not supported in associations with `separate: true`',
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

        const hasSeparateTrue = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'separate' && p.value.value === true);
        if (hasSeparateTrue) return;

        const limitOrOrderProperty = node.properties.find(p => p.type === 'Property' && p.key.type === 'Identifier' && ['limit', 'offset', 'order'].includes(p.key.name));
        if (!limitOrOrderProperty) return;

        context.report({
          node,
          messageId: 'noLimitOrOrderInAssociation',
          data: {
            option: limitOrOrderProperty.key.name,
          }
        });
      },
    };
  },
};
