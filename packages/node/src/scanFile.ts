import { readFile, stat } from "node:fs/promises";
import { scanText } from "@satr-labs/core";
import type { ScanOptions, ScanResult } from "@satr-labs/core";
import {
  DEFAULT_TEXT_EXTENSIONS,
  isProbablyBinaryFile,
  isSupportedTextFile,
  parseMaxFileSize,
} from "./fileUtils";

export type ScanFileOptions = ScanOptions & {
  maxFileSize?: string | number;
  supportedExtensions?: string[];
};

export type FileScanResult = ScanResult & {
  filePath: string;
  skipped: boolean;
  skipReason?: "unsupported-extension" | "binary" | "large-file";
};

function skippedResult(filePath: string, reason: NonNullable<FileScanResult["skipReason"]>): FileScanResult {
  return {
    filePath,
    skipped: true,
    skipReason: reason,
    safe: true,
    riskScore: 0,
    issues: [],
    stats: {
      scannedChars: 0,
      rulesMatched: 0,
      durationMs: 0,
    },
  };
}

export async function scanFile(filePath: string, options: ScanFileOptions = {}): Promise<FileScanResult> {
  const startedAt = performance.now();
  const fileStat = await stat(filePath);
  const maxFileSize = parseMaxFileSize(options.maxFileSize);

  if (fileStat.size > maxFileSize) {
    return skippedResult(filePath, "large-file");
  }

  const supportedExtensions = options.supportedExtensions
    ? new Set(options.supportedExtensions.map((extension) => extension.toLowerCase()))
    : DEFAULT_TEXT_EXTENSIONS;

  if (!isSupportedTextFile(filePath, supportedExtensions)) {
    return skippedResult(filePath, "unsupported-extension");
  }

  if (await isProbablyBinaryFile(filePath)) {
    return skippedResult(filePath, "binary");
  }

  const content = await readFile(filePath, "utf8");
  const result = scanText(content, options);

  return {
    ...result,
    filePath,
    skipped: false,
    issues: result.issues.map((issue) => ({
      ...issue,
      filePath,
    })),
    stats: {
      ...result.stats,
      durationMs: Math.round(performance.now() - startedAt),
    },
  };
}
