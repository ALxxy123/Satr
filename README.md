# Satr

Protect sensitive data before it reaches AI.

Satr is a local-first AI data protection SDK for detecting, redacting, blocking, and
reporting sensitive data in prompts, files, logs, and API payloads before they are sent
to AI providers or external systems.

## Why It Exists

AI features often send prompts, logs, request payloads, and debug files outside the
application boundary. Satr gives developers a deterministic guardrail that runs locally
first, so common secrets, PII, Saudi PII, and business-sensitive terms can be caught
before data leaves the machine or process.

Satr is a developer guardrail, not a complete compliance solution.

## Install

```bash
pnpm add @satr-labs/core @satr-labs/rules
```

For file and directory scanning:

```bash
pnpm add @satr-labs/node
```

For the CLI:

```bash
pnpm add -g @satr-labs/cli
```

Satr v0.1 is ESM-only and supports Node.js 18 or newer.

## Quick Start

```ts
import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const result = scanText("My API key is sk-example1234567890abcdef", {
  rules: ["secrets"],
  ruleRegistry: builtInRules,
  action: "redact",
});

console.log(result.output);
```

Output:

```txt
My API key is [REDACTED:OPENAI_API_KEY]
```

You can also pass rule objects directly:

```ts
import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const result = scanText("Email: ahmad@example.com", {
  rules: builtInRules,
  action: "redact",
});
```

## SDK Usage

### Scan Text

```ts
const scan = scanText(prompt, {
  rules: ["secrets", "pii", "pii-ar-sa"],
  ruleRegistry: builtInRules,
  action: "redact",
});

if (!scan.safe) {
  console.log(scan.issues);
}
```

### Scan Objects

```ts
import { scanObject } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const scan = scanObject(
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

console.log(scan.output);
```

### Scan Files

```ts
import { scanFile } from "@satr-labs/node";
import { resolveBuiltInRules } from "@satr-labs/rules";

const result = await scanFile("./logs/app.txt", {
  rules: resolveBuiltInRules(["secrets", "pii"]),
  action: "report",
});
```

## CLI

Initialize config:

```bash
satr init
```

Scan a file or directory:

```bash
satr scan .
satr scan ./src --rules secrets,pii
satr scan ./logs/app.txt --action redact
satr scan . --action block
satr scan . --format json
```

`satr scan` exits with code `1` when issues are found, which makes it suitable for CI
and pre-release checks.

In v0.1, the CLI reports scan findings. It does not rewrite files or save redacted
copies; use the SDK output when you need redacted text or objects in application code.

Inspect rules:

```bash
satr rules list
satr rules list --type secret
satr rules list --tag openai
satr explain secret.openai_api_key
```

## Config

`satr init` creates:

```json
{
  "locale": "ar-SA",
  "rules": ["secrets", "pii", "pii-ar-sa", "business-sensitive"],
  "action": "report",
  "severityThreshold": "medium",
  "ignore": ["node_modules", ".git", "dist", "build", ".next", "coverage"]
}
```

Satr also reads `.satrignore` for directory scans.

## Built-in Detections

Satr v0.1 includes deterministic rules for:

- Secrets: OpenAI keys, Anthropic keys, GitHub tokens, AWS access key IDs, private key
  blocks, bearer tokens, generic env secrets, and database URLs.
- General PII: email addresses, IP addresses, token-bearing URLs, and broad phone
  candidates.
- Saudi PII: Saudi mobile numbers, Saudi IBANs, and national ID or iqama candidates.
- Business-sensitive context: salary, payroll, contracts, invoices, employee/customer
  data, bank account context, and confidential keywords in English and Arabic.

## Redaction

Rules can redact with these deterministic strategies:

- `full`: replace the whole match with a placeholder.
- `partial`: preserve configured leading/trailing characters.
- `mask`: replace characters with `*`.
- `hash`: replace with a stable local hash token.
- `remove`: remove the match.

Overlapping redactions are resolved by severity and match length so the highest-risk
match wins.

Hash redaction is deterministic but not intended to be cryptographic anonymization.

## Security Model

Satr protects against accidental exposure of secrets, PII, Saudi PII, business-sensitive
terms, unsafe debug sharing, and sensitive file or payload submission before AI usage.

Satr does not fully protect against malicious insiders, compromised machines, encrypted
secrets, binary files, images, OCR content, PDFs, all possible PII formats, or legal
compliance obligations by itself. The built-in rules are deterministic regex and
heuristic checks, so false positives and false negatives are expected in v0.1.

## v0.1 Scope

Included:

- TypeScript core scanner
- Built-in deterministic rules
- Redaction and risk scoring
- Object, file, and directory scanning
- CLI with table and JSON output
- JSON config and ignore file support
- Focused tests and examples

Not included in v0.1:

- Dashboard
- SaaS platform
- Auth or database
- LLM classifiers
- Browser or VS Code extensions
- PDF, DOCX, image, OCR, or spreadsheet scanning

## License

MIT
