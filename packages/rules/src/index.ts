import type { RuleType, SatrRule } from "@satr-labs/core";
import { businessSensitiveRules } from "./business-sensitive";
import { piiArSaRules } from "./pii-ar-sa";
import { piiRules } from "./pii";
import { secretsRules } from "./secrets";

export { businessSensitiveRules } from "./business-sensitive";
export { piiArSaRules } from "./pii-ar-sa";
export { piiRules } from "./pii";
export { secretsRules } from "./secrets";

export type BuiltInRuleGroup = "secrets" | "pii" | "pii-ar-sa" | "business-sensitive";

export const builtInRuleGroups: Record<BuiltInRuleGroup, SatrRule[]> = {
  secrets: secretsRules,
  pii: piiRules,
  "pii-ar-sa": piiArSaRules,
  "business-sensitive": businessSensitiveRules,
};

export const builtInRules: SatrRule[] = [
  ...secretsRules,
  ...piiRules,
  ...piiArSaRules,
  ...businessSensitiveRules,
];

export function getBuiltInRule(ruleId: string): SatrRule | undefined {
  return builtInRules.find((rule) => rule.id === ruleId);
}

export function resolveBuiltInRules(selectors?: string[]): SatrRule[] {
  if (!selectors || selectors.length === 0) {
    return builtInRules;
  }

  const selectedRules: SatrRule[] = [];

  for (const selector of selectors) {
    const group = builtInRuleGroups[selector as BuiltInRuleGroup];

    if (group) {
      selectedRules.push(...group);
      continue;
    }

    selectedRules.push(
      ...builtInRules.filter((rule) => {
        return (
          rule.id === selector ||
          rule.id.startsWith(`${selector}.`) ||
          rule.type === (selector as RuleType) ||
          (rule.tags ?? []).includes(selector)
        );
      }),
    );
  }

  const seen = new Set<string>();
  return selectedRules.filter((rule) => {
    if (seen.has(rule.id)) {
      return false;
    }

    seen.add(rule.id);
    return true;
  });
}
