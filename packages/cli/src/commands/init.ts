import { access, writeFile } from "node:fs/promises";
import path from "node:path";

export const DEFAULT_CONFIG = {
  locale: "ar-SA",
  rules: ["secrets", "pii", "pii-ar-sa", "business-sensitive"],
  action: "report",
  severityThreshold: "medium",
  ignore: ["node_modules", ".git", "dist", "build", ".next", "coverage"],
};

export const DEFAULT_IGNORE_FILE = [
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
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "",
].join("\n");

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function initProject(cwd = process.cwd()): Promise<string[]> {
  const messages: string[] = [];
  const configPath = path.join(cwd, "satr.config.json");
  const ignorePath = path.join(cwd, ".satrignore");

  if (await exists(configPath)) {
    messages.push("satr.config.json already exists.");
  } else {
    await writeFile(configPath, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, "utf8");
    messages.push("Created satr.config.json.");
  }

  if (await exists(ignorePath)) {
    messages.push(".satrignore already exists.");
  } else {
    await writeFile(ignorePath, DEFAULT_IGNORE_FILE, "utf8");
    messages.push("Created .satrignore.");
  }

  return messages;
}
