/**
 * Requires `tableName` and `underscored: true` to be specified in `@Table({ ... })`.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const validateTableDefinitionRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      requireTableNameInTable: 'Missing `tableName` field in @Table() decorator',
      requireUnderscoredInTable: 'Missing `underscored: true` field in @Table() decorator',
      requireOptions: '@Table() decorator requires configuration options',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'Table') {
          return;
        }

        const [options] = node.arguments;
        if (!options || options.type !== 'ObjectExpression') {
          context.report({ node, messageId: 'requireOptions' });
          return;
        }

        const hasTableName = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'tableName');
        if (!hasTableName) {
          context.report({ node: options, messageId: 'requireTableNameInTable' });
        }

        const hasUnderscoredTrue = options.properties.some(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'underscored' && p.value.value === true);
        if (!hasUnderscoredTrue) {
          context.report({
            node: options,
            messageId: 'requireUnderscoredInTable',
            fix(fixer) {
              if (options.properties.length === 0) {
                return fixer.replaceText(options, '{ underscored: true }');
              }

              const lastProperty = options.properties[options.properties.length - 1];
              const textToInsert = context.sourceCode.getText(lastProperty).endsWith(',')
                ? ' underscored: true,'
                : ', underscored: true';

              return fixer.insertTextAfter(lastProperty, textToInsert);
            }
          });
        }
      },
    };
  },
};
