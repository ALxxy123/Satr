import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBuiltInRules } from "@satr-labs/rules";
import { scanDirectory, scanFile } from "../src";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "satr-node-"));
}

describe("@satr-labs/node", () => {
  it("scans a supported text file", async () => {
    const directory = await tempDir();
    const filePath = path.join(directory, "sample.txt");
    await writeFile(filePath, "Email: ahmad@example.com", "utf8");

    const result = await scanFile(filePath, {
      rules: resolveBuiltInRules(["pii"]),
      action: "redact",
    });

    expect(result.skipped).toBe(false);
    expect(result.safe).toBe(false);
    expect(result.issues[0]?.filePath).toBe(filePath);
    expect(result.output).toContain("[REDACTED:EMAIL]");
  });

  it("respects ignore patterns during directory scans", async () => {
    const directory = await tempDir();
    await writeFile(path.join(directory, "visible.txt"), "No sensitive data here.", "utf8");
    await writeFile(path.join(directory, "ignored.txt"), "Email: ahmad@example.com", "utf8");
    await writeFile(path.join(directory, ".satrignore"), "ignored.txt\n", "utf8");

    const result = await scanDirectory(directory, {
      rules: resolveBuiltInRules(["pii"]),
    });

    expect(result.safe).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.files.some((file) => file.filePath.endsWith("ignored.txt"))).toBe(false);
  });

  it("skips unsupported binary-like extensions", async () => {
    const directory = await tempDir();
    const imagePath = path.join(directory, "logo.png");
    await writeFile(imagePath, Buffer.from([0, 1, 2, 3]));

    const result = await scanFile(imagePath, {
      rules: resolveBuiltInRules(["secrets"]),
    });

    expect(result.skipped).toBe(true);
    expect(result.skipReason).toBe("unsupported-extension");
  });
});
