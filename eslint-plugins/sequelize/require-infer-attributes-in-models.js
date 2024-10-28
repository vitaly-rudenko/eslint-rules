/**
 * The best way to define Sequelize models is with `Model<InferAttributes<M>, InferCreationAttribute<M>>`.
 * Reason: consistency and strict type checking, as well as allowing usage of `NonAttribute` and `CreationOptional` types.
 *
 * This rule is simple: require `InferAttributes` and `InferCreationAttributes` to be imported when `Model` and `Table` are imported.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireInferAttributesInModelsRule = {
  meta: {
    type: 'problem',
    messages: {
      missingInferAttributesInModel: 'Sequelize models have to be defined with `Model<InferAttributes<...>, InferCreationAttributes<...>>`'
    },
    schema: [],
  },
  create(context) {
    let hasInferAttributes = false;
    let hasInferCreationAttributes = false;
    let hasModelImport = false;
    let hasTableImport = false;

    return {
      Program() {
        hasInferAttributes = false;
        hasInferCreationAttributes = false;
        hasModelImport = false;
        hasTableImport = false;
      },
      ImportDeclaration(node) {
        if (node.source.value === 'sequelize') {
          for (const specifier of node.specifiers) {
            if (specifier.type !== 'ImportSpecifier') continue;

            hasInferAttributes ||= specifier.imported.name === 'InferAttributes';
            hasInferCreationAttributes ||= specifier.imported.name === 'InferCreationAttributes';
          }
        }

        if (node.source.value === 'sequelize-typescript') {
          for (const specifier of node.specifiers) {
            if (specifier.type !== 'ImportSpecifier') continue;

            hasModelImport ||= specifier.imported.name === 'Model';
            hasTableImport ||= specifier.imported.name === 'Table';
          }
        }
      },
      'Program:exit'(node) {
        if (!hasModelImport || !hasTableImport) return;
        if (hasInferAttributes && hasInferCreationAttributes) return;

        context.report({ node, messageId: 'missingInferAttributesInModel' });
      }
    };
  }
};