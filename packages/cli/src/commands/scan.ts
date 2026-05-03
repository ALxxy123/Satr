import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { SatrAction, SatrConfig } from "@satr/core";
import { scanDirectory, type DirectoryScanResult, type ScanDirectoryOptions } from "@satr/node";
import { resolveBuiltInRules } from "@satr/rules";
import { formatJsonReport } from "../output/json";
import { formatTableReport } from "../output/table";

const VALID_ACTIONS = new Set(["report", "redact", "block"]);
const VALID_FORMATS = new Set(["table", "json"]);

type ScanCommandOptions = {
  rules?: string;
  action?: SatrAction;
  format?: "table" | "json";
  maxFileSize?: string;
};

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

async function readConfig(cwd: string): Promise<SatrConfig> {
  const configPath = path.join(cwd, "satr.config.json");

  let content: string;

  try {
    content = await readFile(configPath, "utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return {};
    }

    const message = error instanceof Error ? error.message : "Unknown read error.";
    throw new Error(`Failed to read satr.config.json: ${message}`);
  }

  try {
    return JSON.parse(content) as SatrConfig;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON.";
    throw new Error(`Invalid satr.config.json: ${message}`);
  }
}

function splitList(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function configRuleSelectors(configRules: SatrConfig["rules"]): string[] | undefined {
  if (!configRules) {
    return undefined;
  }

  const selectors = configRules.filter((rule): rule is string => typeof rule === "string");
  return selectors.length > 0 ? selectors : undefined;
}

function normalizeAction(action: unknown): SatrAction {
  if (typeof action === "string" && VALID_ACTIONS.has(action)) {
    return action as SatrAction;
  }

  throw new Error(`Invalid action "${String(action)}". Expected report, redact, or block.`);
}

function normalizeFormat(format: unknown): "table" | "json" {
  if (typeof format === "string" && VALID_FORMATS.has(format)) {
    return format as "table" | "json";
  }

  throw new Error(`Invalid format "${String(format)}". Expected table or json.`);
}

export async function scanTarget(
  targetPath: string,
  options: ScanCommandOptions = {},
  cwd = process.cwd(),
): Promise<{ result: DirectoryScanResult; output: string; format: "table" | "json" }> {
  const config = await readConfig(cwd);
  const target = path.resolve(cwd, targetPath);
  await stat(target);

  const selectors =
    splitList(options.rules) ?? configRuleSelectors(config.rules) ?? [
      "secrets",
      "pii",
      "pii-ar-sa",
      "business-sensitive",
    ];
  const rules = resolveBuiltInRules(selectors);

  if (rules.length === 0) {
    throw new Error(`No Satr rules matched: ${selectors.join(", ")}`);
  }

  const requestedAction = normalizeAction(options.action ?? config.action ?? "report");
  const scanAction = requestedAction === "block" ? "report" : requestedAction;
  const scanOptions: ScanDirectoryOptions = {
    ...config,
    action: scanAction,
    rules,
    ignore: config.ignore,
    maxFileSize: options.maxFileSize ?? config.maxFileSize,
    concurrency: config.concurrency,
  };
  const result = await scanDirectory(target, scanOptions);
  const format = normalizeFormat(options.format ?? config.output?.format ?? "table");
  const output = format === "json" ? formatJsonReport(result) : formatTableReport(result);

  return { result, output, format };
}
