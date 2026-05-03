import { open } from "node:fs/promises";
import path from "node:path";

export const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const DEFAULT_TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".txt",
  ".md",
  ".yml",
  ".yaml",
  ".log",
  ".csv",
  ".html",
  ".css",
  ".env",
]);

export function normalizePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

export function parseMaxFileSize(value: string | number | undefined): number {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb)?$/i);

  if (!match) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  const amount = Number(match[1]);
  const unit = (match[2] ?? "b").toLowerCase();

  if (unit === "mb") {
    return Math.round(amount * 1024 * 1024);
  }

  if (unit === "kb") {
    return Math.round(amount * 1024);
  }

  return Math.round(amount);
}

export function isSupportedTextFile(filePath: string, extensions = DEFAULT_TEXT_EXTENSIONS): boolean {
  const baseName = path.basename(filePath).toLowerCase();

  if (baseName === ".env" || baseName.startsWith(".env.")) {
    return true;
  }

  return extensions.has(path.extname(baseName));
}

export async function isProbablyBinaryFile(filePath: string): Promise<boolean> {
  const handle = await open(filePath, "r");

  try {
    const buffer = Buffer.alloc(512);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);

    if (bytesRead === 0) {
      return false;
    }

    let suspiciousControlCharacters = 0;

    for (let index = 0; index < bytesRead; index += 1) {
      const value = buffer[index];

      if (value === 0) {
        return true;
      }

      const isAllowedControl = value === 9 || value === 10 || value === 13;

      if (value < 32 && !isAllowedControl) {
        suspiciousControlCharacters += 1;
      }
    }

    return suspiciousControlCharacters / bytesRead > 0.3;
  } finally {
    await handle.close();
  }
}
