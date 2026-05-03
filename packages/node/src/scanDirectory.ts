import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { calculateRiskScore } from "@satr-labs/core";
import type { ScanOptions, SatrIssue } from "@satr-labs/core";
import { DEFAULT_IGNORE_PATTERNS, readIgnoreFile, shouldIgnorePath } from "./ignore";
import { scanFile, type FileScanResult, type ScanFileOptions } from "./scanFile";

export type ScanDirectoryOptions = ScanFileOptions & {
  ignore?: string[];
  concurrency?: number;
};

export type DirectoryScanResult = {
  safe: boolean;
  riskScore: number;
  issues: SatrIssue[];
  files: FileScanResult[];
  summary: {
    filesScanned: number;
    filesSkipped: number;
    issuesFound: number;
  };
  stats: {
    durationMs: number;
  };
};

async function collectFiles(
  rootDirectory: string,
  currentDirectory: string,
  ignorePatterns: string[],
  files: string[],
): Promise<void> {
  const entries = await readdir(currentDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDirectory, entry.name);
    const relativePath = path.relative(rootDirectory, fullPath);

    if (shouldIgnorePath(relativePath, ignorePatterns)) {
      continue;
    }

    if (entry.isDirectory()) {
      await collectFiles(rootDirectory, fullPath, ignorePatterns, files);
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }
}

async function runWithConcurrency<T>(
  items: string[],
  concurrency: number,
  worker: (item: string) => Promise<T>,
): Promise<T[]> {
  const results: T[] = [];
  let nextIndex = 0;

  const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length || 1)) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]!);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function scanDirectory(
  directoryPath: string,
  options: ScanDirectoryOptions = {},
): Promise<DirectoryScanResult> {
  const startedAt = performance.now();
  const rootDirectory = path.resolve(directoryPath);
  const directoryStat = await stat(rootDirectory);

  if (!directoryStat.isDirectory()) {
    const fileResult = await scanFile(rootDirectory, options);
    const issues = fileResult.issues;
    const riskScore = calculateRiskScore(issues);

    return {
      safe: riskScore === 0,
      riskScore,
      issues,
      files: [fileResult],
      summary: {
        filesScanned: fileResult.skipped ? 0 : 1,
        filesSkipped: fileResult.skipped ? 1 : 0,
        issuesFound: issues.length,
      },
      stats: {
        durationMs: Math.round(performance.now() - startedAt),
      },
    };
  }

  const ignoreFilePatterns = await readIgnoreFile(rootDirectory);
  const ignorePatterns = [
    ...DEFAULT_IGNORE_PATTERNS,
    ...ignoreFilePatterns,
    ...(options.ignore ?? []),
  ];
  const files: string[] = [];

  await collectFiles(rootDirectory, rootDirectory, ignorePatterns, files);

  const fileResults = await runWithConcurrency(
    files,
    options.concurrency ?? 8,
    async (filePath) => scanFile(filePath, options),
  );
  const issues = fileResults.flatMap((result) => result.issues);
  const riskScore = calculateRiskScore(issues);

  return {
    safe: riskScore === 0,
    riskScore,
    issues,
    files: fileResults,
    summary: {
      filesScanned: fileResults.filter((result) => !result.skipped).length,
      filesSkipped: fileResults.filter((result) => result.skipped).length,
      issuesFound: issues.length,
    },
    stats: {
      durationMs: Math.round(performance.now() - startedAt),
    },
  };
}
