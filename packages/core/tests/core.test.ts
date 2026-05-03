import { describe, expect, it } from "vitest";
import {
  SatrBlockedError,
  calculateRiskScore,
  defineRule,
  redactText,
  scanObject,
  scanText,
} from "../src";
import type { SatrIssue } from "../src";

const emailRule = defineRule({
  id: "pii.email",
  name: "Email Address",
  type: "pii",
  severity: "high",
  confidence: "high",
  patterns: [{ regex: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", flags: "gi" }],
  redaction: {
    strategy: "full",
    placeholder: "[REDACTED:EMAIL]",
  },
  tags: ["pii", "email"],
});

const tokenRule = defineRule({
  id: "secret.test_token",
  name: "Test Token",
  type: "secret",
  severity: "critical",
  confidence: "high",
  patterns: [{ regex: "tok_[A-Za-z0-9]{8,}", flags: "g" }],
  redaction: {
    strategy: "partial",
    preserveStart: 4,
    preserveEnd: 4,
  },
  tags: ["secret"],
});

describe("@satr/core", () => {
  it("detects and redacts text matches", () => {
    const result = scanText("Email ahmad@example.com before sharing.", {
      rules: [emailRule],
      action: "redact",
    });

    expect(result.safe).toBe(false);
    expect(result.riskScore).toBe(60);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatchObject({
      ruleId: "pii.email",
      line: 1,
      column: 7,
    });
    expect(result.output).toBe("Email [REDACTED:EMAIL] before sharing.");
  });

  it("returns safe results for clean text", () => {
    const result = scanText("This prompt contains no sensitive data.", {
      rules: [emailRule],
    });

    expect(result.safe).toBe(true);
    expect(result.riskScore).toBe(0);
    expect(result.issues).toEqual([]);
  });

  it("supports direct redaction from issue ranges", () => {
    const issue: SatrIssue = {
      ruleId: "secret.test",
      type: "secret",
      severity: "critical",
      confidence: "high",
      message: "Test secret detected.",
      match: "tok_123456789",
      redactedMatch: "[REDACTED:TOKEN]",
      start: 7,
      end: 20,
      tags: ["secret"],
    };

    expect(redactText("Token: tok_123456789", [issue])).toBe("Token: [REDACTED:TOKEN]");
  });

  it("preserves object shape and attaches issue paths", () => {
    const result = scanObject(
      {
        user: {
          email: "ahmad@example.com",
        },
        notes: ["safe", "tok_123456789"],
      },
      {
        rules: [emailRule, tokenRule],
        action: "redact",
      },
    );

    expect(result.safe).toBe(false);
    expect(result.riskScore).toBe(100);
    expect(result.output).toEqual({
      user: {
        email: "[REDACTED:EMAIL]",
      },
      notes: ["safe", "tok_*****6789"],
    });
    expect(result.issues.map((issue) => issue.path)).toEqual(["user.email", "notes[1]"]);
  });

  it("calculates capped risk scores", () => {
    const issues = scanText("tok_123456789 ahmad@example.com", {
      rules: [emailRule, tokenRule],
    }).issues;

    expect(calculateRiskScore(issues)).toBe(100);
  });

  it("throws when block action detects issues", () => {
    expect(() =>
      scanText("Email ahmad@example.com", {
        rules: [emailRule],
        action: "block",
      }),
    ).toThrow(SatrBlockedError);
  });
});
