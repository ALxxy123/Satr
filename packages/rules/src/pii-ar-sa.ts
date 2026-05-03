import { defineRule } from "@satr/core";
import type { SatrRule } from "@satr/core";

export const piiArSaRules: SatrRule[] = [
  defineRule({
    id: "pii_ar_sa.mobile",
    name: "Saudi Mobile Number",
    description: "Detects Saudi mobile numbers in +9665, 9665, and 05 formats.",
    type: "pii",
    severity: "high",
    confidence: "high",
    patterns: [
      {
        regex: "(?<!\\d)(?:\\+9665|9665|05)[0-9]{8}(?!\\d)",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:SAUDI_MOBILE]",
    },
    recommendation: "Redact Saudi mobile numbers before sharing prompts, logs, or payloads.",
    tags: ["pii", "pii-ar-sa", "saudi", "mobile", "phone"],
    examples: ["+966501234567", "0501234567"],
  }),
  defineRule({
    id: "pii_ar_sa.iban",
    name: "Saudi IBAN",
    description: "Detects Saudi IBAN values with SA followed by 22 digits.",
    type: "financial",
    severity: "high",
    confidence: "high",
    patterns: [
      {
        regex: "\\bSA[0-9]{22}\\b",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:SAUDI_IBAN]",
    },
    recommendation: "Redact bank account identifiers before sharing financial data.",
    tags: ["pii", "pii-ar-sa", "saudi", "iban", "financial"],
    examples: ["SA0380000000608010167519"],
  }),
  defineRule({
    id: "pii_ar_sa.national_id_candidate",
    name: "Saudi National ID or Iqama Candidate",
    description: "Detects 10-digit Saudi national ID or iqama candidates that start with 1 or 2.",
    type: "pii",
    severity: "high",
    confidence: "medium",
    patterns: [
      {
        regex: "(?<!\\d)[12][0-9]{9}(?!\\d)",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:SAUDI_ID]",
    },
    recommendation: "Treat this as sensitive until validated. Redact before sharing.",
    tags: ["pii", "pii-ar-sa", "saudi", "national-id", "iqama"],
    examples: ["1023456789", "2123456789"],
  }),
];
