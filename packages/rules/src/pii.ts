import { defineRule } from "@satr-labs/core";
import type { SatrRule } from "@satr-labs/core";

export const piiRules: SatrRule[] = [
  defineRule({
    id: "pii.email",
    name: "Email Address",
    description: "Detects common email addresses.",
    type: "pii",
    severity: "high",
    confidence: "high",
    patterns: [
      {
        regex: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:EMAIL]",
    },
    recommendation: "Remove or redact personal email addresses before sharing content.",
    tags: ["pii", "email"],
    examples: ["ahmad@example.com"],
  }),
  defineRule({
    id: "pii.ip_address",
    name: "IP Address",
    description: "Detects IPv4 addresses.",
    type: "pii",
    severity: "medium",
    confidence: "high",
    patterns: [
      {
        regex:
          "\\b(?:(?:25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\\b",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:IP_ADDRESS]",
    },
    recommendation: "Redact IP addresses when sharing logs outside trusted environments.",
    tags: ["pii", "ip", "network"],
    examples: ["192.168.1.10"],
  }),
  defineRule({
    id: "pii.url_token",
    name: "URL Token Parameter",
    description: "Detects URLs that contain sensitive token-like query parameters.",
    type: "pii",
    severity: "high",
    confidence: "medium",
    patterns: [
      {
        regex:
          "https?://[^\\s\"'<>?]+\\?[^\\s\"'<>]*(?:token|access_token|api_key|key|secret)=[^\\s\"'<>]+",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:URL_WITH_TOKEN]",
    },
    recommendation: "Remove token-bearing URLs before sending content to external systems.",
    tags: ["pii", "token", "url"],
    examples: ["https://example.com/callback?token=secret-token"],
  }),
  defineRule({
    id: "pii.phone_candidate",
    name: "Phone Number Candidate",
    description: "Detects broad international phone-like candidates.",
    type: "pii",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "(?<!\\d)\\+?\\d[\\d .()\\-]{7,}\\d(?!\\d)",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:PHONE]",
    },
    recommendation: "Review and redact phone numbers before sharing content.",
    tags: ["pii", "phone"],
    examples: ["+1 415 555 0199"],
  }),
];
