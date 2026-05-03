import path from "node:path";
import type { DirectoryScanResult } from "@satr-labs/node";

function pad(value: string, length: number): string {
  return value.length >= length ? value : `${value}${" ".repeat(length - value.length)}`;
}

function location(line?: number, column?: number): string {
  if (!line) {
    return "-";
  }

  return column ? `${line}:${column}` : String(line);
}

function relativeFile(filePath: string | undefined): string {
  if (!filePath) {
    return "-";
  }

  return path.relative(process.cwd(), filePath) || filePath;
}

export function formatTableReport(result: DirectoryScanResult): string {
  const lines = [
    "Satr Scan Report",
    "",
    `Status: ${result.safe ? "Safe" : "Unsafe"}`,
    `Risk Score: ${result.riskScore}`,
    `Files scanned: ${result.summary.filesScanned}`,
    `Files skipped: ${result.summary.filesSkipped}`,
    `Issues found: ${result.summary.issuesFound}`,
  ];

  if (result.issues.length === 0) {
    return `${lines.join("\n")}\n`;
  }

  const rows = result.issues.map((issue) => [
    issue.severity,
    issue.type,
    issue.ruleId,
    relativeFile(issue.filePath),
    location(issue.line, issue.column),
  ]);
  const headers = ["Severity", "Type", "Rule", "File", "Location"];
  const widths = headers.map((header, columnIndex) => {
    return Math.max(header.length, ...rows.map((row) => row[columnIndex]!.length));
  });

  lines.push("");
  lines.push(headers.map((header, index) => pad(header, widths[index]!)).join("  "));
  lines.push(widths.map((width) => "-".repeat(width)).join("  "));

  for (const row of rows) {
    lines.push(row.map((value, index) => pad(value, widths[index]!)).join("  "));
  }

  return `${lines.join("\n")}\n`;
}
