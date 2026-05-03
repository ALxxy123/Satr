import { describe, expect, it } from "vitest";
import { scanText } from "@satr-labs/core";
import { builtInRules, resolveBuiltInRules } from "../src";

describe("@satr-labs/rules", () => {
  it("exports built-in rules", () => {
    expect(builtInRules.length).toBeGreaterThan(10);
    expect(builtInRules.some((rule) => rule.id === "secret.openai_api_key")).toBe(true);
  });

  it("detects OpenAI API keys", () => {
    const result = scanText("OPENAI_API_KEY=sk-example1234567890abcdef", {
      rules: resolveBuiltInRules(["secrets"]),
      action: "redact",
    });

    expect(result.safe).toBe(false);
    expect(result.issues.some((issue) => issue.ruleId === "secret.openai_api_key")).toBe(true);
    expect(result.output).toContain("[REDACTED:OPENAI_API_KEY]");
  });

  it("does not flag short sk-prefixed strings as OpenAI API keys", () => {
    const result = scanText("The test id is sk-demo12345.", {
      rules: resolveBuiltInRules(["secrets"]),
    });

    expect(result.issues.some((issue) => issue.ruleId === "secret.openai_api_key")).toBe(false);
  });

  it("detects email addresses", () => {
    const result = scanText("Contact ahmad@example.com for the account.", {
      rules: resolveBuiltInRules(["pii"]),
    });

    expect(result.issues.map((issue) => issue.ruleId)).toContain("pii.email");
  });

  it("detects Saudi mobile numbers", () => {
    const result = scanText("Customer mobile is +966501234567.", {
      rules: resolveBuiltInRules(["pii-ar-sa"]),
    });

    expect(result.issues.map((issue) => issue.ruleId)).toContain("pii_ar_sa.mobile");
  });

  it("detects Saudi IBAN values", () => {
    const result = scanText("IBAN SA0380000000608010167519 belongs to the customer.", {
      rules: resolveBuiltInRules(["pii-ar-sa"]),
    });

    expect(result.issues.map((issue) => issue.ruleId)).toContain("pii_ar_sa.iban");
  });

  it("detects Arabic business-sensitive keywords", () => {
    const result = scanText("هذا عقد سري يحتوي على راتب الموظف.", {
      rules: resolveBuiltInRules(["business-sensitive"]),
    });

    expect(result.issues.length).toBeGreaterThanOrEqual(3);
    expect(result.issues.map((issue) => issue.ruleId)).toContain("business.contract");
    expect(result.issues.map((issue) => issue.ruleId)).toContain("business.confidential");
  });
});
