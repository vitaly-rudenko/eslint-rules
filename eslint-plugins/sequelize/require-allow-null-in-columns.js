/**
 * Require `allowNull` to be specified in `@Column()`.
 * Reason: clarity and consistency with migrations.
 * 
 * Exceptions: `primaryKey: true`.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireAllowNullInColumnsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireAllowNullInColumn: 'Missing `allowNull` field in @Column() decorator',
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        const isInColumnDecorator = node.parent.type === 'CallExpression'
          && node.parent.callee.type === 'Identifier'
          && node.parent.callee.name === 'Column'
        if (!isInColumnDecorator) return;

        const hasAllowNull = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'allowNull')
        if (hasAllowNull) return;

        const hasPrimaryKeyTrue = node.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'primaryKey' && p.value.value === true)
        if (hasPrimaryKeyTrue) return;

        context.report({ node, messageId: 'requireAllowNullInColumn' });
      },
    };
  },
};
