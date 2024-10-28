/**
 * Require `references`, `onDelete` and `onUpdate` fields to be specified in `@Column()`.
 * Reason: consistency with migrations.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateReferencesInColumnsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireReferencesInColumn: 'Foreign key column requires all these options to be set: `references`, `onUpdate` and `onDelete`',
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const isInColumnDecorator = node.parent.type === 'CallExpression'
          && node.parent.callee.type === 'Identifier'
          && node.parent.callee.name === 'Column'
        if (!isInColumnDecorator) return;

        const hasReferences = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'references')
        const hasOnDelete = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'onUpdate')
        const hasOnUpdate = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'onDelete')
        if (!hasReferences && !hasOnDelete && !hasOnUpdate) return;
        if (hasReferences && hasOnDelete && hasOnUpdate) return;

        context.report({ node, messageId: 'requireReferencesInColumn' });
      },
    };
  },
};
