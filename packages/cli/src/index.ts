#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command, Option } from "commander";
import { initProject } from "./commands/init";
import { explainRule, listRules } from "./commands/rules";
import { scanTarget } from "./commands/scan";

export function createProgram(): Command {
  const program = new Command();

  program.name("satr").description("Local-first sensitive data scanner for AI workflows.").version("0.1.0");

  program
    .command("init")
    .description("Create satr.config.json and .satrignore.")
    .action(async () => {
      const messages = await initProject();
      console.log(messages.join("\n"));
    });

  program
    .command("scan")
    .description("Scan a file or directory.")
    .argument("[target]", "File or directory to scan", ".")
    .option("--rules <rules>", "Comma-separated rule groups or rule IDs")
    .addOption(new Option("--action <action>", "report, redact, or block").choices(["report", "redact", "block"]))
    .addOption(new Option("--format <format>", "table or json").choices(["table", "json"]))
    .option("--max-file-size <size>", "Maximum file size, for example 2MB")
    .action(async (target: string, options: Record<string, string | undefined>) => {
      const { result, output } = await scanTarget(target, {
        rules: options.rules,
        action: options.action as "report" | "redact" | "block" | undefined,
        format: options.format as "table" | "json" | undefined,
        maxFileSize: options.maxFileSize,
      });

      console.log(output.trimEnd());
      process.exitCode = result.safe ? 0 : 1;
    });

  const rulesCommand = program.command("rules").description("Inspect built-in rules.");

  rulesCommand
    .command("list")
    .description("List built-in rules.")
    .option("--type <type>", "Filter by rule type")
    .option("--tag <tag>", "Filter by tag")
    .option("--format <format>", "table or json")
    .action((options: Record<string, string | undefined>) => {
      console.log(
        listRules({
          type: options.type as never,
          tag: options.tag,
          format: options.format as "table" | "json" | undefined,
        }).trimEnd(),
      );
    });

  program
    .command("explain")
    .description("Explain a built-in rule.")
    .argument("<rule-id>", "Rule ID")
    .action((ruleId: string) => {
      console.log(explainRule(ruleId).trimEnd());
    });

  return program;
}

const isDirectExecution = process.argv[1]
  ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
  : false;

if (isDirectExecution) {
  createProgram().parseAsync(process.argv).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown Satr CLI error.";
    console.error(message);
    process.exitCode = 1;
  });
}
