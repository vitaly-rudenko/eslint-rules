/**
 * 1. Do not allow combining `separate: true` and `required: true` in associations.
 * Reason: `separate` splits query into multiple queries, silently ignoring `required: true`.
 *
 * 2. Enforce `separate` to be specified unless `required: true` is set.
 * Reason: awareness of this option leads to better performance and memory usage.
 *
 * Check is only preformed in `include: [...]` arrays, in objects where `model` is specified.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateSeparateInAssociationsRule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      invalidSeparateInRequiredAssociation: 'Option `separate: true` is not supported in associations with `required: true`',
      missingSeparateInNonRequiredAssociation: 'Explicitly add `separate: false` field to the association',
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

        const requiredProperty = node.properties.find(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'required');
        if (!requiredProperty) return; // don't check if 'required' is missing

        const separateProperty = node.properties.find(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'separate');

        if (requiredProperty.value.value === true && separateProperty?.value.value === true) {
          context.report({
            node,
            messageId: 'invalidSeparateInRequiredAssociation',
            fix(fixer) {
              return fixer.replaceText(separateProperty, 'separate: false')
            }
          });
        }

        if (requiredProperty.value.value === false && !separateProperty) {
          context.report({
            node,
            messageId: 'missingSeparateInNonRequiredAssociation',
            fix(fixer) {
              const lastProperty = node.properties[node.properties.length - 1];
              const comma = context.sourceCode.getText(lastProperty).endsWith(',') ? ' ' : ', ';

              return fixer.insertTextAfter(lastProperty, comma + 'separate: false');
            }
          });
        }
      },
    };
  },
};
