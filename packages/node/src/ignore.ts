import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizePath } from "./fileUtils";

export const DEFAULT_IGNORE_PATTERNS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".cache",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.webp",
  "*.pdf",
  "*.docx",
  "*.xlsx",
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
];

function escapeRegExp(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globToRegExp(pattern: string): RegExp {
  const normalizedPattern = normalizePath(pattern);
  const regex = escapeRegExp(normalizedPattern).replaceAll("\\*", ".*");

  return new RegExp(`(^|/)${regex}$`);
}

export async function readIgnoreFile(cwd: string): Promise<string[]> {
  const ignorePath = path.join(cwd, ".satrignore");

  try {
    const content = await readFile(ignorePath, "utf8");

    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
  } catch {
    return [];
  }
}

export function shouldIgnorePath(relativePath: string, patterns: string[]): boolean {
  const normalizedPath = normalizePath(relativePath);
  const segments = normalizedPath.split("/");

  return patterns.some((rawPattern) => {
    const pattern = normalizePath(rawPattern.trim());

    if (!pattern || pattern.startsWith("#")) {
      return false;
    }

    if (pattern.includes("*")) {
      return globToRegExp(pattern).test(normalizedPath) || globToRegExp(pattern).test(path.basename(normalizedPath));
    }

    const directoryPattern = pattern.endsWith("/") ? pattern.slice(0, -1) : pattern;

    return (
      normalizedPath === directoryPattern ||
      normalizedPath.startsWith(`${directoryPattern}/`) ||
      segments.includes(directoryPattern)
    );
  });
}
