import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { initProject } from "../src/commands/init";
import { explainRule, listRules } from "../src/commands/rules";
import { scanTarget } from "../src/commands/scan";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "satr-cli-"));
}

describe("@satr-labs/cli", () => {
  it("initializes config files", async () => {
    const directory = await tempDir();
    const messages = await initProject(directory);

    expect(messages).toContain("Created satr.config.json.");
    expect(messages).toContain("Created .satrignore.");

    const config = JSON.parse(await readFile(path.join(directory, "satr.config.json"), "utf8")) as {
      rules: string[];
    };

    expect(config.rules).toContain("secrets");
  });

  it("lists and explains built-in rules", () => {
    expect(listRules({ tag: "openai" })).toContain("secret.openai_api_key");
    expect(explainRule("pii.email")).toContain("Email Address");
  });

  it("scans a file and returns JSON output", async () => {
    const directory = await tempDir();
    await writeFile(path.join(directory, "payload.txt"), "Email: ahmad@example.com", "utf8");

    const { result, output } = await scanTarget(
      "payload.txt",
      {
        rules: "pii",
        format: "json",
      },
      directory,
    );
    const parsed = JSON.parse(output) as { safe: boolean; summary: { issuesFound: number } };

    expect(result.safe).toBe(false);
    expect(parsed.safe).toBe(false);
    expect(parsed.summary.issuesFound).toBe(1);
  });

  it("uses relative file paths in JSON reports", async () => {
    const directory = await tempDir();
    await writeFile(path.join(directory, "payload.txt"), "Email: ahmad@example.com", "utf8");

    const { output } = await scanTarget(
      "payload.txt",
      {
        rules: "pii",
        format: "json",
      },
      directory,
    );
    const parsed = JSON.parse(output) as { issues: Array<{ filePath?: string }> };

    expect(path.isAbsolute(parsed.issues[0]?.filePath ?? "")).toBe(false);
    expect(parsed.issues[0]?.filePath).toContain("payload.txt");
  });

  it("fails loudly for invalid JSON config", async () => {
    const directory = await tempDir();
    await writeFile(path.join(directory, "satr.config.json"), "{ nope", "utf8");
    await writeFile(path.join(directory, "payload.txt"), "safe", "utf8");

    await expect(scanTarget("payload.txt", {}, directory)).rejects.toThrow("Invalid satr.config.json");
  });
});
