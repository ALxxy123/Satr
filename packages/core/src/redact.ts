import type { RedactionConfig, SatrIssue } from "./types";

const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;

function defaultPlaceholder(issue: SatrIssue): string {
  return `[REDACTED:${issue.ruleId.toUpperCase().replaceAll(".", "_")}]`;
}

export function redactMatch(
  match: string,
  issue: SatrIssue,
  config?: RedactionConfig,
  defaultStrategy?: RedactionConfig["strategy"],
): string {
  const strategy = config?.strategy ?? defaultStrategy ?? "full";

  if (strategy === "remove") {
    return "";
  }

  if (strategy === "mask") {
    return "*".repeat(match.length);
  }

  if (strategy === "partial") {
    const preserveStart = config?.preserveStart ?? 2;
    const preserveEnd = config?.preserveEnd ?? 4;

    if (match.length <= preserveStart + preserveEnd) {
      return "*".repeat(match.length);
    }

    return `${match.slice(0, preserveStart)}${"*".repeat(
      match.length - preserveStart - preserveEnd,
    )}${match.slice(-preserveEnd)}`;
  }

  if (strategy === "hash") {
    let hash = 0;

    for (let i = 0; i < match.length; i += 1) {
      hash = (hash << 5) - hash + match.charCodeAt(i);
      hash |= 0;
    }

    return `[HASH:${Math.abs(hash).toString(16)}]`;
  }

  return config?.placeholder ?? defaultPlaceholder(issue);
}

function overlaps(left: SatrIssue, right: SatrIssue): boolean {
  return left.start < right.end && right.start < left.end;
}

function selectNonOverlappingIssues(issues: SatrIssue[]): SatrIssue[] {
  const ranked = [...issues].sort((a, b) => {
    const severityDelta = severityRank[b.severity] - severityRank[a.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }

    const lengthDelta = b.end - b.start - (a.end - a.start);
    if (lengthDelta !== 0) {
      return lengthDelta;
    }

    return a.start - b.start;
  });

  const accepted: SatrIssue[] = [];

  for (const issue of ranked) {
    if (!accepted.some((existing) => overlaps(existing, issue))) {
      accepted.push(issue);
    }
  }

  return accepted.sort((a, b) => b.start - a.start);
}

export function redactText(input: string, issues: SatrIssue[]): string {
  const sortedIssues = selectNonOverlappingIssues(issues);

  let output = input;

  for (const issue of sortedIssues) {
    const replacement = issue.redactedMatch ?? redactMatch(issue.match, issue);
    output = output.slice(0, issue.start) + replacement + output.slice(issue.end);
  }

  return output;
}
