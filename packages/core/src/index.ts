export { defineSatrConfig } from "./config";
export { SatrBlockedError, SatrConfigError, SatrError, SatrRuleError } from "./errors";
export { redactMatch, redactText } from "./redact";
export { calculateRiskScore } from "./riskScore";
export { defineRule, resolveRules } from "./rules";
export { scanObject } from "./scanObject";
export { scanText } from "./scanText";

export type {
  Confidence,
  RedactionConfig,
  RedactionStrategy,
  RulePattern,
  RuleSelector,
  RuleType,
  SatrAction,
  SatrConfig,
  SatrIssue,
  SatrRule,
  ScanOptions,
  ScanResult,
  ScanStats,
  Severity,
} from "./types";
