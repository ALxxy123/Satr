import { SatrRuleError } from "./errors";
import type { RuleSelector, SatrRule } from "./types";

function isRule(value: RuleSelector): value is SatrRule {
  return typeof value === "object" && value !== null && "id" in value;
}

export function defineRule(rule: SatrRule): SatrRule {
  if (!rule.id.trim()) {
    throw new SatrRuleError("Rule id is required.");
  }

  if (!rule.name.trim()) {
    throw new SatrRuleError(`Rule "${rule.id}" must have a name.`);
  }

  if (rule.patterns.length === 0) {
    throw new SatrRuleError(`Rule "${rule.id}" must define at least one pattern.`);
  }

  for (const pattern of rule.patterns) {
    try {
      new RegExp(pattern.regex, pattern.flags);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid regular expression.";
      throw new SatrRuleError(`Rule "${rule.id}" has an invalid pattern: ${message}`);
    }
  }

  return rule;
}

export function resolveRules(
  selectors: RuleSelector[] | undefined,
  registry: SatrRule[] = [],
  customRules: SatrRule[] = [],
): SatrRule[] {
  const availableRules = [...registry, ...customRules].filter((rule) => rule.enabled !== false);

  if (!selectors || selectors.length === 0) {
    return availableRules;
  }

  const selectedRules: SatrRule[] = [];

  for (const selector of selectors) {
    if (isRule(selector)) {
      if (selector.enabled !== false) {
        selectedRules.push(selector);
      }

      continue;
    }

    const matches = availableRules.filter((rule) => {
      return (
        rule.id === selector ||
        rule.id.startsWith(`${selector}.`) ||
        rule.type === selector ||
        (rule.tags ?? []).includes(selector)
      );
    });

    selectedRules.push(...matches);
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
