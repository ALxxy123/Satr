import { scanText } from "./scanText";
import { SatrBlockedError } from "./errors";
import { calculateRiskScore } from "./riskScore";
import type { ScanOptions, ScanResult, SatrIssue } from "./types";

type ObjectScanValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ObjectScanValue[]
  | { [key: string]: ObjectScanValue };

function pathFor(parent: string, key: string | number): string {
  if (typeof key === "number") {
    return `${parent}[${key}]`;
  }

  return parent ? `${parent}.${key}` : key;
}

function scanValue(
  value: ObjectScanValue,
  options: ScanOptions,
  path: string,
): { output: ObjectScanValue; issues: SatrIssue[]; scannedChars: number } {
  if (typeof value === "string") {
    const result = scanText(value, {
      ...options,
      action: options.action === "redact" ? "redact" : "report",
    });

    return {
      output: result.output ?? value,
      issues: result.issues.map((issue) => ({
        ...issue,
        path: path || undefined,
      })),
      scannedChars: value.length,
    };
  }

  if (Array.isArray(value)) {
    const output: ObjectScanValue[] = [];
    const issues: SatrIssue[] = [];
    let scannedChars = 0;

    value.forEach((item, index) => {
      const child = scanValue(item, options, pathFor(path, index));
      output.push(child.output);
      issues.push(...child.issues);
      scannedChars += child.scannedChars;
    });

    return { output, issues, scannedChars };
  }

  if (value && typeof value === "object") {
    const output: Record<string, ObjectScanValue> = {};
    const issues: SatrIssue[] = [];
    let scannedChars = 0;

    for (const [key, childValue] of Object.entries(value)) {
      const childPath = pathFor(path, key);
      const child = scanValue(childValue, options, childPath);

      output[key] = child.output;
      issues.push(...child.issues);
      scannedChars += child.scannedChars;
    }

    return { output, issues, scannedChars };
  }

  return {
    output: value,
    issues: [],
    scannedChars: 0,
  };
}

export function scanObject<T extends ObjectScanValue>(input: T, options: ScanOptions = {}): ScanResult<T> {
  const startTime = performance.now();
  const scanned = scanValue(input, options, "");
  const output = scanned.output as T;
  const riskScore = calculateRiskScore(scanned.issues);
  const result: ScanResult<T> = {
    safe: riskScore === 0,
    riskScore,
    issues: scanned.issues,
    output: options.action === "redact" ? output : undefined,
    stats: {
      scannedChars: scanned.scannedChars,
      rulesMatched: new Set(scanned.issues.map((issue) => issue.ruleId)).size,
      durationMs: Math.round(performance.now() - startTime),
    },
  };

  if (options.action === "block" && !result.safe) {
    throw new SatrBlockedError(result);
  }

  return result;
}
