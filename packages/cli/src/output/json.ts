import path from "node:path";
import type { DirectoryScanResult } from "@satr-labs/node";

function relativeFilePath(filePath: string | undefined): string | undefined {
  if (!filePath) {
    return undefined;
  }

  return path.relative(process.cwd(), filePath) || filePath;
}

export function formatJsonReport(result: DirectoryScanResult): string {
  const counts = {
    critical: result.issues.filter((issue) => issue.severity === "critical").length,
    high: result.issues.filter((issue) => issue.severity === "high").length,
    medium: result.issues.filter((issue) => issue.severity === "medium").length,
    low: result.issues.filter((issue) => issue.severity === "low").length,
  };

  return JSON.stringify(
    {
      safe: result.safe,
      riskScore: result.riskScore,
      summary: {
        filesScanned: result.summary.filesScanned,
        filesSkipped: result.summary.filesSkipped,
        issuesFound: result.summary.issuesFound,
        ...counts,
      },
      issues: result.issues.map((issue) => ({
        ...issue,
        filePath: relativeFilePath(issue.filePath),
      })),
    },
    null,
    2,
  );
}
