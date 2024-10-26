import { noLimitOrOrderInAssociationsRule } from "./no-limit-or-order-in-associations.js";
import { requireAllowNullInColumnsRule } from "./require-allow-null-in-columns.js";
import { requireAttributesInQueriesRule } from "./require-attributes-in-queries.js";
import { requireLimitInFindAllRule } from "./require-limit-in-find-all.js";
import { requireRequiredInAssociationsRule } from "./require-required-in-associations.js";
import { separateNotRequiredInAssociationsRule } from "./separate-not-required-in-associations.js";
import { validateReferencesInColumnsRule } from "./validate-references-in-columns.js";
import { validateTableDefinition } from "./validate-table-definition.js";
import { validateThroughAssociationsRule } from "./validate-through-associations.js";

export const eslintSequelizePlugin = {
  rules: {
    'no-limit-or-order-in-associations': noLimitOrOrderInAssociationsRule,
    'require-allow-null-in-columns': requireAllowNullInColumnsRule,
    'require-attributes-in-queries': requireAttributesInQueriesRule,
    'require-limit-in-find-all': requireLimitInFindAllRule,
    'require-required-in-associations': requireRequiredInAssociationsRule,
    'separate-not-required-in-associations': separateNotRequiredInAssociationsRule,
    'validate-references-in-columns': validateReferencesInColumnsRule,
    'validate-table-definition': validateTableDefinition,
    'validate-through-associations': validateThroughAssociationsRule,
  },
};