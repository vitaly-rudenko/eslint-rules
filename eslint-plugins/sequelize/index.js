import { noLimitOrOrderInAssociationsRule } from './no-limit-or-order-in-associations.js';
import { requireInferAttributesInModelsRule } from './require-infer-attributes-in-models.js';
import { requireLimitInFindAllRule } from './require-limit-in-find-all.js';
import { requireRequiredInAssociationsRule } from './require-required-in-associations.js';
import { separateNotRequiredInAssociationsRule } from './separate-not-required-in-associations.js';
import { validateColumnDefinitionRule } from './validate-column-definition.js';
import { validateReferencesInColumnsRule } from './validate-references-in-columns.js';
import { validateTableDefinitionRule } from './validate-table-definition.js';
import { validateThroughAssociationsRule } from './validate-through-associations.js';

export const eslintSequelizePlugin = {
  rules: {
    'no-limit-or-order-in-associations': noLimitOrOrderInAssociationsRule,
    'require-infer-attributes-in-models': requireInferAttributesInModelsRule,
    'require-limit-in-find-all': requireLimitInFindAllRule,
    'require-required-in-associations': requireRequiredInAssociationsRule,
    'separate-not-required-in-associations': separateNotRequiredInAssociationsRule,
    'validate-column-definition': validateColumnDefinitionRule,
    'validate-references-in-columns': validateReferencesInColumnsRule,
    'validate-table-definition': validateTableDefinitionRule,
    'validate-through-associations': validateThroughAssociationsRule,
  },
};