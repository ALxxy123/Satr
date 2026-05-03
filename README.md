<p align="center">
  <img src="./assets/logo.png" alt="Satr logo" width="140" />
</p>

<h1 align="center">Satr</h1>

<p align="center">
  <strong>Protect sensitive data before it reaches AI.</strong>
</p>

<p align="center">
  Satr is a local-first AI data protection SDK and CLI for detecting, redacting, blocking,
  and reporting sensitive data in prompts, files, logs, objects, and API payloads before
  they are sent to AI providers or external systems.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-0EA5A4" alt="Beta status" />
  <img src="https://img.shields.io/badge/license-MIT-1B2330" alt="MIT license" />
  <img src="https://img.shields.io/badge/TypeScript-ready-3178C6" alt="TypeScript ready" />
  <img src="https://img.shields.io/badge/local--first-yes-0EA5A4" alt="Local-first" />
  <img src="https://img.shields.io/badge/deterministic-rules-1B2330" alt="Deterministic rules" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@satr-labs/core">
    <img src="https://img.shields.io/npm/v/@satr-labs/core?label=%40satr-labs%2Fcore" alt="@satr-labs/core" />
  </a>
  <a href="https://www.npmjs.com/package/@satr-labs/rules">
    <img src="https://img.shields.io/npm/v/@satr-labs/rules?label=%40satr-labs%2Frules" alt="@satr-labs/rules" />
  </a>
  <a href="https://www.npmjs.com/package/@satr-labs/node">
    <img src="https://img.shields.io/npm/v/@satr-labs/node?label=%40satr-labs%2Fnode" alt="@satr-labs/node" />
  </a>
  <a href="https://www.npmjs.com/package/@satr-labs/cli">
    <img src="https://img.shields.io/npm/v/@satr-labs/cli?label=%40satr-labs%2Fcli" alt="@satr-labs/cli" />
  </a>
</p>

---

## Why Satr?

Modern AI-powered applications often send prompts, logs, request payloads, and support
files outside the application boundary. That creates a simple but serious failure mode:
secrets, personal data, customer information, or internal business context can reach AI
providers or external systems unintentionally.

Satr gives developers a deterministic, local-first guardrail that runs before data leaves
the process. It helps detect, redact, block, and report sensitive information through a
small TypeScript SDK and a practical CLI.

Satr is intentionally focused. It is not an AI framework, not a SaaS product, and not a
full enterprise DLP platform.

> Satr is a developer guardrail, not a complete compliance solution.

---

## Features

- **Local-first scanning** with no external network calls in the scanner
- **Deterministic detection** using rules, regex, validators, and heuristics
- **Built-in coverage** for secrets, general PII, Saudi PII, and business-sensitive context
- **Multiple input types** for text, objects, files, and directories
- **Flexible actions** for reporting, redaction, and blocking
- **SDK and CLI** for application code, local workflows, and CI checks
- **Config and ignore support** through `satr.config.json` and `.satrignore`
- **TypeScript-first API** with strict types and small package boundaries

---

## Install

### Core SDK and Built-in Rules

```bash
pnpm add @satr-labs/core @satr-labs/rules
```

### File and Directory Scanning

```bash
pnpm add @satr-labs/node
```

### CLI

```bash
pnpm add -g @satr-labs/cli
```

Satr v0.1 is ESM-only and supports Node.js 18 or newer.

---

## Quick Start

```ts
import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const result = scanText("Email ahmad@example.com", {
  rules: ["pii"],
  ruleRegistry: builtInRules,
  action: "redact",
});

console.log(result.output);
```

Expected output:

```txt
Email [REDACTED:EMAIL]
```

You can also pass rule objects directly:

```ts
import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const result = scanText("My API key is sk-example1234567890abcdef", {
  rules: builtInRules,
  action: "redact",
});

console.log(result.output);
```

---

## SDK Usage

### Scan Text

```ts
import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const prompt = `
Please summarize this support note before I send it to an AI provider.
Email ahmad@example.com
`;

const result = scanText(prompt, {
  rules: ["pii"],
  ruleRegistry: builtInRules,
  action: "redact",
});

if (!result.safe) {
  console.log(result.issues);
}

console.log(result.output);
```

### Scan Objects

```ts
import { scanObject } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const result = scanObject(
  {
    user: {
      email: "ahmad@example.com",
      phone: "+966501234567",
    },
  },
  {
    rules: ["pii", "pii-ar-sa"],
    ruleRegistry: builtInRules,
    action: "redact",
  },
);

console.log(result.output);
```

Example output:

```ts
{
  user: {
    email: "[REDACTED:EMAIL]",
    phone: "[REDACTED:SAUDI_MOBILE]",
  },
}
```

### Scan Files

```ts
import { scanFile } from "@satr-labs/node";
import { resolveBuiltInRules } from "@satr-labs/rules";

const result = await scanFile("./logs/app.txt", {
  rules: resolveBuiltInRules(["secrets", "pii"]),
  action: "report",
});

console.log(result.issues);
```

---

## CLI Usage

Initialize a Satr config:

```bash
satr init
```

Scan a file or directory:

```bash
satr scan .
satr scan ./src --rules secrets,pii
satr scan ./logs/app.txt --action redact
satr scan . --format json
```

Inspect built-in rules:

```bash
satr rules list
satr rules list --tag openai
satr explain secret.openai_api_key
```

`satr scan` exits with code `1` when issues are found, which makes it suitable for CI
and pre-release checks.

> In v0.1, `satr scan --action redact` reports findings and redaction metadata, but it
> does **not** rewrite files on disk. Use the SDK when you need redacted text or objects
> in application code.

---

## Built-in Detections

### Secrets

- OpenAI API keys
- Anthropic API keys
- GitHub tokens
- AWS access key IDs
- Private key blocks
- Bearer tokens
- Generic `.env` secrets
- Database URLs

### General PII

- Email addresses
- IP addresses
- Token-bearing URLs
- Broad phone candidates

### Saudi PII

- Saudi mobile numbers
- Saudi IBANs
- Saudi national ID candidates
- Iqama number candidates

### Business-sensitive Context

English and Arabic keyword detection for:

- Salary and payroll
- Contracts and agreements
- Invoices
- Employee and customer data
- Bank account context
- Confidential content

---

## Redaction Strategies

| Strategy  | Behavior                                             |
| --------- | ---------------------------------------------------- |
| `full`    | Replaces the entire match with a placeholder         |
| `partial` | Preserves configured leading and trailing characters |
| `mask`    | Replaces characters with `*`                         |
| `hash`    | Replaces the value with a stable local hash token    |
| `remove`  | Removes the value entirely                           |

Example:

```txt
Input:  Email ahmad@example.com
Output: Email [REDACTED:EMAIL]
```

Hash redaction is deterministic, but it is not intended to be cryptographic anonymization.

---

## Security Model

Satr helps reduce accidental exposure of:

- Secrets in prompts and logs
- PII in payloads and support files
- Saudi PII in text and file-based workflows
- Business-sensitive content before AI usage
- Unsafe debug or support-file sharing
- Sensitive request payloads sent to external systems

Satr does **not** fully protect against:

- Malicious insiders
- Compromised machines
- Encrypted or obfuscated secrets
- Binary file inspection in a broad enterprise DLP sense
- OCR or image-based extraction
- Full PDF, DOCX, image, or spreadsheet scanning in v0.1
- Every possible PII format or jurisdictional rule
- Legal or compliance obligations on its own

The built-in rules are deterministic regex and heuristic checks, so false positives and
false negatives are expected in v0.1.

> Satr is a developer guardrail, not a complete compliance solution.

---

## v0.1 Scope

### Included

- TypeScript core scanner
- Built-in deterministic rules
- Redaction and risk scoring
- Text and object scanning
- File and directory scanning
- CLI with table and JSON output
- Config and ignore support
- Focused tests and examples

### Not Included

- Dashboard
- SaaS platform
- Authentication or database
- LLM classifiers
- Browser extension
- VS Code extension
- PDF, DOCX, image, OCR, or spreadsheet scanning

---

## Packages

| Package            | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| `@satr-labs/core`  | Core scanner, types, redaction, risk scoring, and public SDK APIs                 |
| `@satr-labs/rules` | Built-in rule packs for secrets, PII, Saudi PII, and business-sensitive detection |
| `@satr-labs/node`  | Node.js utilities for scanning files and directories                              |
| `@satr-labs/cli`   | Command-line interface for initialization, scanning, and rule inspection          |

---

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
```

Run the CLI locally after building:

```bash
node ./packages/cli/dist/index.js rules list
```

---

## License

MIT
