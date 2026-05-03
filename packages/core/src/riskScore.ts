import type { SatrIssue } from "./types";

const severityWeight = {
  low: 10,
  medium: 30,
  high: 60,
  critical: 90,
} as const;

const confidenceModifier = {
  low: 0.5,
  medium: 0.75,
  high: 1,
} as const;

export function calculateRiskScore(issues: SatrIssue[]): number {
  const score = issues.reduce((total, issue) => {
    return total + severityWeight[issue.severity] * confidenceModifier[issue.confidence];
  }, 0);

  return Math.min(100, Math.round(score));
}