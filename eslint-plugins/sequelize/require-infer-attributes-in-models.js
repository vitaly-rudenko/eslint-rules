/**
 * Best way to define Sequelize models is using `extends Model<InferAttributes<M>, InferCreationAttribute<M>>`.
 * Reason: consistency and strict type checking, as well as allowing usage of `NonAttribute` and `CreationOptional` types.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const requireInferAttributesInModels = {
  meta: {
    type: 'problem',
    messages: {
      missingInferAttributesInModel: 'Use InferAttributes & InferCreationAttributes in Sequelize model definition'
    },
    schema: [],
  },
  create(context) {
    let hasInferAttributes = false;
    let hasInferCreationAttributes = false;

    return {
      Program() {
        hasInferAttributes = false;
        hasInferCreationAttributes = false;
      },
      ImportDeclaration(node) {
        if (node.source.value === 'sequelize') {
          node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportSpecifier') {
              if (specifier.imported.name === 'InferAttributes') {
                hasInferAttributes = true;
              }
              if (specifier.imported.name === 'InferCreationAttributes') {
                hasInferCreationAttributes = true;
              }
            }
          });
        }
      },
      'Program:exit'(node) {
        if (!hasInferAttributes || !hasInferCreationAttributes) {
          context.report({
            node,
            messageId: 'missingInferAttributesInModel'
          });
        }
      }
    };
  }
};
