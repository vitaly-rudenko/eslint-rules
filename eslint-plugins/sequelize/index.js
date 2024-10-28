import { noLimitOrOrderInAssociationsRule } from './no-limit-or-order-in-associations.js';
import { requireInferAttributesInModelsRule } from './require-infer-attributes-in-models.js';
import { requireLimitInFindAllRule } from './require-limit-in-find-all.js';
import { requireRequiredInAssociationsRule } from './require-required-in-associations.js';
import { validateColumnDefinitionRule } from './validate-column-definition.js';
import { validateReferencesInColumnsRule } from './validate-references-in-columns.js';
import { validateSeparateInAssociationsRule } from './validate-separate-in-associations.js';
import { validateTableDefinitionRule } from './validate-table-definition.js';
import { validateThroughAssociationsRule } from './validate-through-associations.js';

export const eslintSequelizePlugin = {
  rules: {
    'no-limit-or-order-in-associations': noLimitOrOrderInAssociationsRule,
    'require-infer-attributes-in-models': requireInferAttributesInModelsRule,
    'require-limit-in-find-all': requireLimitInFindAllRule,
    'require-required-in-associations': requireRequiredInAssociationsRule,
    'validate-column-definition': validateColumnDefinitionRule,
    'validate-references-in-columns': validateReferencesInColumnsRule,
    'validate-separate-in-associations': validateSeparateInAssociationsRule,
    'validate-table-definition': validateTableDefinitionRule,
    'validate-through-associations': validateThroughAssociationsRule,
  },
};