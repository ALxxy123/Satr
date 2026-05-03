import type { RuleType, SatrRule } from "@satr/core";
import { builtInRules, getBuiltInRule } from "@satr/rules";

type ListRulesOptions = {
  type?: RuleType;
  tag?: string;
  format?: "table" | "json";
};

function pad(value: string, length: number): string {
  return value.length >= length ? value : `${value}${" ".repeat(length - value.length)}`;
}

export function listRules(options: ListRulesOptions = {}): string {
  const rules = builtInRules.filter((rule) => {
    if (options.type && rule.type !== options.type) {
      return false;
    }

    if (options.tag && !(rule.tags ?? []).includes(options.tag)) {
      return false;
    }

    return true;
  });

  if (options.format === "json") {
    return JSON.stringify(rules, null, 2);
  }

  const headers = ["Rule", "Type", "Severity", "Confidence"];
  const rows = rules.map((rule) => [rule.id, rule.type, rule.severity, rule.confidence]);
  const widths = headers.map((header, index) => Math.max(header.length, ...rows.map((row) => row[index]!.length)));
  const lines = [
    "Built-in Satr Rules",
    "",
    headers.map((header, index) => pad(header, widths[index]!)).join("  "),
    widths.map((width) => "-".repeat(width)).join("  "),
    ...rows.map((row) => row.map((value, index) => pad(value, widths[index]!)).join("  ")),
  ];

  return `${lines.join("\n")}\n`;
}

function formatExamples(rule: SatrRule): string {
  if (!rule.examples || rule.examples.length === 0) {
    return "-";
  }

  return rule.examples.map((example) => `- ${example}`).join("\n");
}

export function explainRule(ruleId: string): string {
  const rule = getBuiltInRule(ruleId);

  if (!rule) {
    throw new Error(`Unknown Satr rule: ${ruleId}`);
  }

  return [
    rule.name,
    "",
    `ID: ${rule.id}`,
    `Type: ${rule.type}`,
    `Severity: ${rule.severity}`,
    `Confidence: ${rule.confidence}`,
    "",
    rule.description ?? "No description available.",
    "",
    "Examples:",
    formatExamples(rule),
    "",
    "Recommendation:",
    rule.recommendation ?? "Review the detected content before sharing.",
    "",
  ].join("\n");
}
