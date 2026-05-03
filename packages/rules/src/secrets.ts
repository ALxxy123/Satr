import { defineRule } from "@satr-labs/core";
import type { SatrRule } from "@satr-labs/core";

export const secretsRules: SatrRule[] = [
  defineRule({
    id: "secret.openai_api_key",
    name: "OpenAI API Key",
    description: "Detects OpenAI-style API keys.",
    type: "secret",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "\\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\\b",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:OPENAI_API_KEY]",
    },
    recommendation: "Remove this API key before sharing content. Rotate it if it was exposed.",
    tags: ["secrets", "secret", "api-key", "openai", "ai"],
    examples: ["OPENAI_API_KEY=sk-example1234567890"],
  }),
  defineRule({
    id: "secret.anthropic_api_key",
    name: "Anthropic API Key",
    description: "Detects Anthropic-style API keys.",
    type: "secret",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "\\bsk-ant-[A-Za-z0-9_-]{20,}\\b",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:ANTHROPIC_API_KEY]",
    },
    recommendation: "Remove this API key before sharing content. Rotate it if it was exposed.",
    tags: ["secrets", "secret", "api-key", "anthropic", "ai"],
    examples: ["ANTHROPIC_API_KEY=sk-ant-exampletoken1234567890"],
  }),
  defineRule({
    id: "secret.github_token",
    name: "GitHub Token",
    description: "Detects common GitHub personal access token formats.",
    type: "secret",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "\\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\\b",
        flags: "g",
      },
      {
        regex: "\\bgithub_pat_[A-Za-z0-9_]{20,}\\b",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:GITHUB_TOKEN]",
    },
    recommendation: "Remove this token and rotate it in GitHub if it was exposed.",
    tags: ["secrets", "secret", "token", "github"],
    examples: ["GITHUB_TOKEN=ghp_exampletoken1234567890123"],
  }),
  defineRule({
    id: "secret.aws_access_key_id",
    name: "AWS Access Key ID",
    description: "Detects AWS access key IDs.",
    type: "cloud",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "\\b(?:AKIA|ASIA)[A-Z0-9]{16}\\b",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:AWS_ACCESS_KEY_ID]",
    },
    recommendation: "Remove this key and rotate the associated AWS credentials if exposed.",
    tags: ["secrets", "secret", "aws", "cloud", "access-key"],
    examples: ["AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE"],
  }),
  defineRule({
    id: "secret.private_key_block",
    name: "Private Key Block",
    description: "Detects PEM private key blocks.",
    type: "secret",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "-----BEGIN [A-Z ]*PRIVATE KEY-----[\\s\\S]*?-----END [A-Z ]*PRIVATE KEY-----",
        flags: "g",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:PRIVATE_KEY]",
    },
    recommendation: "Never send private keys to AI providers or external systems.",
    tags: ["secrets", "secret", "private-key", "pem"],
    examples: ["-----BEGIN PRIVATE KEY-----"],
  }),
  defineRule({
    id: "secret.bearer_token",
    name: "Bearer Token",
    description: "Detects Authorization Bearer token headers.",
    type: "auth",
    severity: "critical",
    confidence: "medium",
    patterns: [
      {
        regex: "\\bAuthorization\\s*:\\s*Bearer\\s+[A-Za-z0-9._~+/=-]{16,}",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "Authorization: Bearer [REDACTED:BEARER_TOKEN]",
    },
    recommendation: "Remove authorization headers before sharing logs or prompts.",
    tags: ["secrets", "secret", "token", "auth", "bearer"],
    examples: ["Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI"],
  }),
  defineRule({
    id: "secret.generic_env_secret",
    name: "Generic Environment Secret",
    description: "Detects API keys, tokens, secrets, and passwords in .env-style assignments.",
    type: "secret",
    severity: "high",
    confidence: "medium",
    patterns: [
      {
        regex:
          "\\b(?!(?:OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|AWS_ACCESS_KEY_ID|DATABASE_URL)\\b)[A-Z0-9_]*(?:API[_-]?KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*\\s*=\\s*[\"']?[A-Za-z0-9._~+/=-]{12,}[\"']?",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:ENV_SECRET]",
    },
    recommendation: "Remove secret environment values before sharing files or logs.",
    tags: ["secrets", "secret", "env", "api-key", "token"],
    examples: ["PAYMENT_API_KEY=live_secret_value_12345"],
  }),
  defineRule({
    id: "secret.database_url",
    name: "Database URL",
    description: "Detects common database connection URLs.",
    type: "secret",
    severity: "critical",
    confidence: "high",
    patterns: [
      {
        regex: "\\b(?:postgres(?:ql)?|mysql|mongodb(?:\\+srv)?|redis)://[^\\s\"'<>]+",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:DATABASE_URL]",
    },
    recommendation: "Do not share database connection strings. Rotate credentials if exposed.",
    tags: ["secrets", "secret", "database", "connection-string"],
    examples: ["DATABASE_URL=postgres://user:pass@localhost:5432/app"],
  }),
];
