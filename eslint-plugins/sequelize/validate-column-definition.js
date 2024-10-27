/**
 * Require `allowNull` and `type` to be specified in `@Column({ ... })`.
 * Reason: clarity and consistency with migrations.
 *
 * Exceptions: when `primaryKey: true`, `allowNull` can be omitted.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateColumnDefinitionRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireAllowNullInColumn: 'Missing `allowNull` field in @Column() decorator',
      requireTypeInColumn: 'Missing `type` field in @Column() decorator',
      requireOptions: '@Column() decorator requires configuration options',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'Column') {
          return;
        }

        const [options] = node.arguments;
        if (!options || options.type !== 'ObjectExpression') {
          context.report({ node, messageId: 'requireOptions' });
          return;
        }

        const hasType = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'type');
        if (!hasType) {
          context.report({ node: options, messageId: 'requireTypeInColumn' });
        }

        const hasAllowNull = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'allowNull');
        const hasPrimaryKeyTrue = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'primaryKey' && p.value.value === true);
        if (!hasAllowNull && !hasPrimaryKeyTrue) {
          context.report({
            node: options,
            messageId: 'requireAllowNullInColumn',
            fix(fixer) {
              if (options.properties.length === 0) {
                return fixer.replaceText(options, '{ allowNull: true }');
              }

              const lastProperty = options.properties[options.properties.length - 1];
              const textToInsert = context.sourceCode.getText(lastProperty).endsWith(',') ? ' allowNull: true,' : ', allowNull: true';

              return fixer.insertTextAfter(lastProperty, textToInsert);
            }
          });
        }
      },
    };
  },
};