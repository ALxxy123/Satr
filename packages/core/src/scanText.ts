import { SatrBlockedError } from "./errors";
import { calculateRiskScore } from "./riskScore";
import { redactMatch, redactText } from "./redact";
import { resolveRules } from "./rules";
import type { RedactionStrategy, ScanOptions, ScanResult, SatrIssue, SatrRule } from "./types";

const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;

function getLineColumn(input: string, index: number): { line: number; column: number } {
  const before = input.slice(0, index);
  const lines = before.split(/\r?\n/);

  return {
    line: lines.length,
    column: lines[lines.length - 1]!.length + 1,
  };
}

function normalizeFlags(flags?: string): string {
  const safeFlags = flags ?? "g";
  const uniqueFlags = Array.from(new Set(safeFlags.split(""))).join("");

  return uniqueFlags.includes("g") ? uniqueFlags : `${uniqueFlags}g`;
}

function createIssue(
  rule: SatrRule,
  match: RegExpExecArray,
  input: string,
  defaultStrategy: RedactionStrategy | undefined,
): SatrIssue {
  const matchedText = match[0];
  const start = match.index;
  const end = start + matchedText.length;
  const location = getLineColumn(input, start);

  const issue: SatrIssue = {
    ruleId: rule.id,
    type: rule.type,
    severity: rule.severity,
    confidence: rule.confidence,
    message: `${rule.name} detected.`,
    match: matchedText,
    start,
    end,
    line: location.line,
    column: location.column,
    recommendation: rule.recommendation,
    tags: rule.tags ?? [],
  };

  return {
    ...issue,
    redactedMatch: redactMatch(matchedText, issue, rule.redaction, defaultStrategy),
  };
}

function dedupeIssues(issues: SatrIssue[]): SatrIssue[] {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.ruleId}:${issue.start}:${issue.end}:${issue.match}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isAtOrAboveSeverity(issue: SatrIssue, threshold: NonNullable<ScanOptions["severityThreshold"]>): boolean {
  return severityRank[issue.severity] >= severityRank[threshold];
}

export function scanText(input: string, options: ScanOptions = {}): ScanResult {
  const startTime = performance.now();
  const action = options.action ?? "report";
  const severityThreshold = options.severityThreshold ?? "medium";
  const enabledRules = resolveRules(options.rules, options.ruleRegistry, options.customRules);

  const issues: SatrIssue[] = [];

  for (const rule of enabledRules) {
    for (const pattern of rule.patterns) {
      const regex = new RegExp(pattern.regex, normalizeFlags(pattern.flags));

      let match: RegExpExecArray | null;

      while ((match = regex.exec(input)) !== null) {
        issues.push(createIssue(rule, match, input, options.redaction?.defaultStrategy));

        if (match[0].length === 0) {
          regex.lastIndex += 1;
        }
      }
    }
  }

  const normalizedIssues = dedupeIssues(issues);
  const riskScore = calculateRiskScore(normalizedIssues);
  const safe =
    riskScore === 0 && !normalizedIssues.some((issue) => isAtOrAboveSeverity(issue, severityThreshold));

  const result: ScanResult = {
    safe,
    riskScore,
    issues: normalizedIssues,
    output: action === "redact" ? redactText(input, normalizedIssues) : undefined,
    stats: {
      scannedChars: input.length,
      rulesMatched: new Set(normalizedIssues.map((issue) => issue.ruleId)).size,
      durationMs: Math.round(performance.now() - startTime),
    },
  };

  if (action === "block" && !safe) {
    throw new SatrBlockedError(result);
  }

  return result;
}
