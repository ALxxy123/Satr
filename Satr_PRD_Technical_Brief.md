# PRD + Technical Product Brief: Satr

## 1. Project Name

**Satr**

Arabic name: **ستر**

---

## 2. One-line Description

Satr is a local-first AI data protection SDK that detects, redacts, blocks, and reports sensitive data before prompts, files, logs, or API payloads are sent to AI providers or external systems.

---

## 3. Tagline

**Protect sensitive data before it reaches AI.**

Arabic tagline:

**احمِ البيانات الحساسة قبل وصولها للذكاء الاصطناعي.**

---

## 4. Product Vision

Satr is a developer-first security SDK and CLI tool designed to protect sensitive data in modern AI-powered applications.

As teams increasingly integrate AI providers such as OpenAI, Anthropic, Gemini, local LLMs, and internal AI agents into their products, they often send user prompts, logs, debug data, documents, and API payloads directly into AI systems without a clear data protection layer.

Satr solves this problem by acting as a local guardrail layer that runs before data leaves the application.

It scans data locally, detects sensitive information, redacts or blocks it based on configurable rules, and generates structured reports for developers and security teams.

The core idea:

> Before any data reaches AI, Satr checks whether it contains sensitive information.

---

## 5. Product Positioning

Satr is not an AI framework.

Satr is not a LangChain alternative.

Satr is not a full DLP enterprise platform in v0.1.

Satr is a lightweight, deterministic, local-first security layer for developers building AI-powered software.

It should feel like:

- ESLint for sensitive data before AI usage
- Zod-like developer experience for data protection
- Git-secrets style scanner, but focused on AI prompts, payloads, files, and logs
- Local-first guardrails for AI applications

---

## 6. Core Problem

Developers are building AI features quickly, but sensitive data can easily leak into AI providers.

Examples of risky data:

- API keys
- Access tokens
- Private keys
- Emails
- Phone numbers
- Saudi national IDs
- Iqama numbers
- IBANs
- Customer data
- Employee data
- Salaries
- Contracts
- Legal documents
- Internal business information
- Logs containing credentials
- Debug traces with secrets
- Webhook payloads
- Database connection strings

Most teams do not have a simple developer-friendly layer to detect and stop this before it leaves the app.

Satr provides this missing layer.

---

## 7. Main Use Cases

### 7.1 Protect AI Prompts

Before sending user input to an AI model, scan the prompt.

```ts
const result = scanText(userPrompt, {
  rules: ["secrets", "pii", "pii-ar-sa"],
  action: "redact",
});

const safePrompt = result.output;
```

### 7.2 Protect AI File Uploads

Before uploading a text file, log file, markdown file, JSON file, or code file to an AI provider, scan it locally.

### 7.3 Protect Logs

Before sending logs to AI for debugging, scan and redact secrets.

### 7.4 Protect API Payloads

Before sending request bodies or webhook payloads to an external system, scan JSON objects.

### 7.5 CI/CD Scanning

Use Satr CLI to scan a repository before deployment or before committing sensitive data.

### 7.6 Developer Security Audits

Use Satr to inspect a codebase, logs, or exported support files for sensitive data exposure.

---

## 8. Target Users

### Primary Users

- Full-stack developers
- AI application developers
- SaaS builders
- Backend engineers
- DevSecOps engineers
- Startup engineering teams
- Internal tools teams

### Secondary Users

- Security teams
- Compliance teams
- AI governance teams
- Engineering managers
- Open-source maintainers

---

## 9. Initial Product Scope

The first version should be small, sharp, and useful.

Do not overbuild.

The first version should focus on:

- TypeScript core scanner
- Node.js support
- CLI tool
- Built-in deterministic rules
- Redaction engine
- Risk scoring
- JSON/table reports
- Config file
- Ignore file
- Clear developer API
- Strong tests
- Excellent README

---

## 10. What Satr Should Not Do in v0.1

Do not build these in v0.1:

- Dashboard
- SaaS platform
- Database
- Auth system
- Team management
- Browser extension
- VS Code extension
- Python SDK
- Laravel package
- AI classifier
- Vector database
- LangChain integration
- PDF scanning
- DOCX scanning
- OCR
- Full enterprise DLP
- Complex compliance automation

These can come later.

---

## 11. Technical Philosophy

Satr should be:

### Local-first

All scanning must happen locally by default.

No user data should be sent to any external server.

### Deterministic

v0.1 should use rules, regex, validators, and heuristics.

No LLM is required in the core scanner.

### Fast

It should be fast enough to run in request middleware, CLI scans, and CI workflows.

### Developer-first

The API should be simple, predictable, typed, documented, and easy to integrate.

### Configurable

Developers should be able to enable/disable rules, add custom rules, configure redaction, and set severity thresholds.

### Safe by default

Default rules should protect common secrets and personal information.

---

## 12. Recommended Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Package manager:** pnpm
- **Monorepo:** pnpm workspaces
- **Build tool:** tsup
- **Testing:** Vitest
- **Schema validation:** Zod
- **CLI framework:** Commander for v0.1
- **Config formats:** JSON first, YAML later or optional in v0.1
- **Linting:** ESLint
- **Formatting:** Prettier
- **Release management:** Changesets
- **Documentation:** Markdown README first, VitePress or Nextra later

---

## 13. Repository Structure

Use a monorepo structure.

```txt
satr/
├─ packages/
│  ├─ core/
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  ├─ scanText.ts
│  │  │  ├─ scanObject.ts
│  │  │  ├─ redact.ts
│  │  │  ├─ riskScore.ts
│  │  │  ├─ rules/
│  │  │  ├─ types.ts
│  │  │  └─ errors.ts
│  │  ├─ tests/
│  │  └─ package.json
│  │
│  ├─ node/
│  │  ├─ src/
│  │  │  ├─ scanFile.ts
│  │  │  ├─ scanDirectory.ts
│  │  │  ├─ ignore.ts
│  │  │  └─ fileUtils.ts
│  │  ├─ tests/
│  │  └─ package.json
│  │
│  ├─ cli/
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  ├─ commands/
│  │  │  │  ├─ init.ts
│  │  │  │  ├─ scan.ts
│  │  │  │  └─ rules.ts
│  │  │  └─ output/
│  │  │     ├─ table.ts
│  │  │     └─ json.ts
│  │  ├─ tests/
│  │  └─ package.json
│  │
│  └─ rules/
│     ├─ src/
│     │  ├─ index.ts
│     │  ├─ secrets.ts
│     │  ├─ pii.ts
│     │  ├─ pii-ar-sa.ts
│     │  └─ business-sensitive.ts
│     ├─ tests/
│     └─ package.json
│
├─ examples/
│  ├─ openai-node/
│  ├─ anthropic-node/
│  ├─ express-api/
│  └─ nextjs-api-route/
│
├─ docs/
│  ├─ getting-started.md
│  ├─ rules.md
│  ├─ redaction.md
│  ├─ cli.md
│  └─ threat-model.md
│
├─ fixtures/
│  ├─ clean/
│  └─ sensitive/
│
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ vitest.config.ts
├─ eslint.config.js
├─ prettier.config.js
├─ README.md
└─ LICENSE
```

---

## 14. Package Design

### 14.1 `@satr-labs/core`

The core package contains the pure scanning engine.

It should avoid Node-specific APIs when possible.

Main responsibilities:

- Define core types
- Accept text input
- Accept object input
- Apply rules
- Detect matches
- Normalize issues
- Calculate risk score
- Redact output
- Return structured results

Main exports:

```ts
export { scanText } from "./scanText";
export { scanObject } from "./scanObject";
export { redactText } from "./redact";
export { defineRule } from "./rules";
export { defineSatrConfig } from "./config";

export type {
  SatrRule,
  ScanOptions,
  ScanResult,
  SatrIssue,
  Severity,
  RuleType,
  RedactionStrategy,
};
```

### 14.2 `@satr-labs/node`

Node-specific package.

Main responsibilities:

- Scan files
- Scan directories
- Handle filesystem
- Respect ignore patterns
- Detect binary files
- Enforce max file size
- Parallelize scanning

Main exports:

```ts
export { scanFile } from "./scanFile";
export { scanDirectory } from "./scanDirectory";
```

### 14.3 `@satr-labs/cli`

Command-line interface.

Main commands:

```bash
satr init
satr scan
satr rules
satr explain
```

### 14.4 `@satr-labs/rules`

Built-in rules package.

Rule groups:

- secrets
- pii
- pii-ar-sa
- financial
- employee-data
- legal
- auth
- cloud

In v0.1, keep the number of rules limited but accurate.

---

## 15. Core API

### 15.1 `scanText`

```ts
import { scanText } from "@satr-labs/core";

const result = scanText("My API key is sk-xxxx", {
  rules: ["secrets", "pii"],
  action: "redact",
});
```

Expected result:

```ts
{
  safe: false,
  riskScore: 95,
  issues: [
    {
      ruleId: "secret.openai_api_key",
      type: "secret",
      severity: "critical",
      confidence: "high",
      message: "OpenAI API key detected.",
      match: "sk-xxxx",
      redactedMatch: "sk-****",
      start: 14,
      end: 45,
      line: 1,
      column: 15,
      recommendation: "Remove or rotate this API key before sharing this content.",
      tags: ["secret", "api-key", "openai"]
    }
  ],
  output: "My API key is [REDACTED:OPENAI_API_KEY]",
  stats: {
    scannedChars: 28,
    rulesMatched: 1,
    durationMs: 3
  }
}
```

### 15.2 `scanObject`

Input:

```ts
const result = scanObject(req.body, {
  rules: ["secrets", "pii", "pii-ar-sa"],
  action: "redact",
});
```

Expected behavior:

- Recursively scan object values
- Preserve object shape
- Redact string values where needed
- Return issue paths

Example issue path:

```ts
"path": "user.profile.phone"
```

Example output:

```ts
{
  safe: false,
  output: {
    user: {
      name: "Ahmad",
      phone: "[REDACTED:SAUDI_MOBILE]"
    }
  },
  issues: [
    {
      ruleId: "pii.saudi_mobile",
      path: "user.phone",
      severity: "high"
    }
  ]
}
```

### 15.3 `scanFile`

```ts
import { scanFile } from "@satr-labs/node";

const result = await scanFile("./logs/app.log", {
  rules: ["secrets", "pii"],
  action: "report",
});
```

### 15.4 `scanDirectory`

```ts
import { scanDirectory } from "@satr-labs/node";

const result = await scanDirectory("./src", {
  rules: ["secrets", "pii"],
  ignore: ["node_modules", ".git", "dist"],
  action: "report",
});
```

---

## 16. Core Types

### Severity

```ts
type Severity = "low" | "medium" | "high" | "critical";
```

### Confidence

```ts
type Confidence = "low" | "medium" | "high";
```

### RuleType

```ts
type RuleType =
  | "secret"
  | "pii"
  | "financial"
  | "legal"
  | "employee_data"
  | "auth"
  | "cloud"
  | "business_sensitive"
  | "custom";
```

### Action

```ts
type Action = "report" | "redact" | "block";
```

### RedactionStrategy

```ts
type RedactionStrategy =
  | "full"
  | "partial"
  | "mask"
  | "hash"
  | "remove";
```

### SatrRule

```ts
type SatrRule = {
  id: string;
  name: string;
  description?: string;
  type: RuleType;
  severity: Severity;
  confidence: Confidence;
  patterns: RulePattern[];
  redaction?: RedactionConfig;
  recommendation?: string;
  tags?: string[];
  enabled?: boolean;
};
```

### RulePattern

```ts
type RulePattern = {
  regex: string;
  flags?: string;
};
```

### RedactionConfig

```ts
type RedactionConfig = {
  strategy: RedactionStrategy;
  placeholder?: string;
  preserveStart?: number;
  preserveEnd?: number;
};
```

### SatrIssue

```ts
type SatrIssue = {
  ruleId: string;
  type: RuleType;
  severity: Severity;
  confidence: Confidence;
  message: string;
  match: string;
  redactedMatch?: string;
  start: number;
  end: number;
  line?: number;
  column?: number;
  path?: string;
  recommendation?: string;
  tags: string[];
};
```

### ScanResult

```ts
type ScanResult<TOutput = string> = {
  safe: boolean;
  riskScore: number;
  issues: SatrIssue[];
  output?: TOutput;
  stats: {
    scannedChars: number;
    rulesMatched: number;
    durationMs: number;
  };
};
```

### ScanOptions

```ts
type ScanOptions = {
  rules?: string[];
  customRules?: SatrRule[];
  action?: Action;
  locale?: string;
  severityThreshold?: Severity;
  redaction?: {
    defaultStrategy?: RedactionStrategy;
  };
};
```

---

## 17. Rule System

Rules should be deterministic and configurable.

Each rule should include:

- id
- name
- description
- type
- severity
- confidence
- regex patterns
- redaction behavior
- recommendation
- tags

Example rule:

```ts
const openAiApiKeyRule: SatrRule = {
  id: "secret.openai_api_key",
  name: "OpenAI API Key",
  description: "Detects OpenAI-style API keys.",
  type: "secret",
  severity: "critical",
  confidence: "high",
  patterns: [
    {
      regex: "\\bsk-[A-Za-z0-9_-]{20,}\\b",
      flags: "g",
    },
  ],
  redaction: {
    strategy: "full",
    placeholder: "[REDACTED:OPENAI_API_KEY]",
  },
  recommendation:
    "Remove this API key before sending content to AI providers. Rotate the key if it was exposed.",
  tags: ["secret", "api-key", "openai"],
};
```

---

## 18. Built-in Rules for v0.1

### 18.1 Secrets

Must detect:

- OpenAI API keys
- Anthropic API keys
- GitHub tokens
- AWS access key ID
- Private key blocks
- Bearer tokens
- Generic API keys in `.env` style files
- Database URLs

Example patterns:

```txt
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GITHUB_TOKEN=...
AWS_ACCESS_KEY_ID=...
DATABASE_URL=postgres://...
Authorization: Bearer ...
-----BEGIN PRIVATE KEY-----
```

### 18.2 PII General

Must detect:

- Email addresses
- International phone-like candidates
- IP addresses
- URLs with token query parameters

### 18.3 PII Saudi / ar-SA

Must detect:

- Saudi mobile numbers
- Saudi national ID candidates
- Iqama candidates
- Saudi IBAN

Saudi mobile examples:

```txt
+9665XXXXXXXX
9665XXXXXXXX
05XXXXXXXX
```

Saudi IBAN:

```txt
SA + 22 digits
```

National ID / Iqama:

- 10 digits
- starts with 1 or 2
- should be treated as candidate in v0.1
- later add checksum validation

### 18.4 Business Sensitive

Detect sensitive business context keywords.

Arabic and English keywords:

```txt
salary
salaries
payroll
bonus
invoice
contract
agreement
employee
staff
customer
client
bank account
iban
legal
confidential

راتب
رواتب
مكافأة
مستحقات
فاتورة
عقد
اتفاقية
موظف
عضو فريق
عميل
حساب بنكي
آيبان
سري
خاص
بيانات حساسة
```

Business-sensitive keyword rules should have lower confidence unless combined with data-like patterns.

---

## 19. Redaction Engine

Satr must support redaction.

### Strategies

#### full

Replace entire match.

```txt
[REDACTED:EMAIL]
```

#### partial

Preserve part of the value.

```txt
ah***@gmail.com
```

#### mask

Replace characters with asterisks.

```txt
********1234
```

#### hash

Replace with stable hash.

```txt
[HASH:abc123]
```

#### remove

Remove the matched value completely.

### Redaction Output Examples

Input:

```txt
My email is ahmad@example.com
```

Output:

```txt
My email is [REDACTED:EMAIL]
```

Input:

```txt
Phone: +966501234567
```

Output:

```txt
Phone: [REDACTED:SAUDI_MOBILE]
```

Input:

```txt
OPENAI_API_KEY=sk-abc123
```

Output:

```txt
OPENAI_API_KEY=[REDACTED:OPENAI_API_KEY]
```

---

## 20. Risk Scoring

Risk score should be from 0 to 100.

Simple scoring for v0.1:

```ts
const severityWeight = {
  low: 10,
  medium: 30,
  high: 60,
  critical: 90,
};
```

Confidence modifier:

```ts
const confidenceModifier = {
  low: 0.5,
  medium: 0.75,
  high: 1,
};
```

Formula:

```ts
riskScore = Math.min(
  100,
  sum(issues.map(issue => severityWeight[issue.severity] * confidenceModifier[issue.confidence]))
);
```

`safe` should be false if:

- riskScore > 0
- or any issue severity is equal or above severityThreshold

Default severityThreshold:

```txt
medium
```

---

## 21. CLI Requirements

### Command: `satr init`

Creates:

```txt
satr.config.json
.satrignore
```

Example config:

```json
{
  "locale": "ar-SA",
  "rules": ["secrets", "pii", "pii-ar-sa", "business-sensitive"],
  "action": "report",
  "severityThreshold": "medium",
  "ignore": ["node_modules", ".git", "dist", "build", ".next", "coverage"]
}
```

Example `.satrignore`:

```txt
node_modules
.git
dist
build
.next
coverage
.cache
*.png
*.jpg
*.jpeg
*.gif
*.webp
*.pdf
*.docx
pnpm-lock.yaml
package-lock.json
yarn.lock
```

### Command: `satr scan`

Examples:

```bash
satr scan ./src
satr scan ./logs/app.log
satr scan . --rules secrets,pii
satr scan . --action redact
satr scan . --format json
satr scan . --format table
```

### Command: `satr rules`

Examples:

```bash
satr rules list
satr rules list --type secret
satr rules list --tag ai
```

### Command: `satr explain`

Example:

```bash
satr explain secret.openai_api_key
```

Should output:

- rule name
- description
- severity
- confidence
- examples
- recommendation

---

## 22. CLI Output

### Table Output

Example:

```txt
Satr Scan Report

Status: Unsafe
Risk Score: 95
Files scanned: 12
Issues found: 3

┌──────────┬──────────┬───────────────────────┬────────────┬────────────┐
│ Severity │ Type     │ Rule                  │ File       │ Location   │
├──────────┼──────────┼───────────────────────┼────────────┼────────────┤
│ critical │ secret   │ secret.openai_api_key │ .env       │ 3:12       │
│ high     │ pii      │ pii.email             │ logs.txt   │ 10:5       │
└──────────┴──────────┴───────────────────────┴────────────┴────────────┘
```

### JSON Output

```json
{
  "safe": false,
  "riskScore": 95,
  "summary": {
    "filesScanned": 12,
    "issuesFound": 3,
    "critical": 1,
    "high": 1,
    "medium": 1,
    "low": 0
  },
  "issues": []
}
```

---

## 23. File Scanning Requirements

For directory scanning:

- Recursively scan files
- Ignore binary files
- Ignore large files above max file size
- Respect `.satrignore`
- Skip `node_modules` by default
- Skip `.git` by default
- Skip build outputs
- Support concurrency
- Return per-file results

Default max file size:

```txt
2MB
```

Default concurrency:

```txt
8
```

Supported text file extensions in v0.1:

```txt
.ts
.tsx
.js
.jsx
.json
.env
.txt
.md
.yml
.yaml
.log
.csv
.html
.css
```

Unsupported in v0.1:

```txt
.pdf
.docx
.xlsx
.png
.jpg
.jpeg
.webp
```

---

## 24. Config System

Support config from:

```txt
satr.config.json
```

Optional later:

```txt
satr.config.yaml
satr.config.ts
```

Config type:

```ts
type SatrConfig = {
  locale?: string;
  rules?: string[];
  customRules?: SatrRule[];
  action?: Action;
  severityThreshold?: Severity;
  ignore?: string[];
  maxFileSize?: string | number;
  concurrency?: number;
  output?: {
    format?: "table" | "json";
    file?: string;
  };
  redaction?: {
    defaultStrategy?: RedactionStrategy;
  };
};
```

Helper:

```ts
export function defineSatrConfig(config: SatrConfig): SatrConfig {
  return config;
}
```

---

## 25. Error Handling

Create clear custom errors.

```ts
class SatrError extends Error {}
class SatrBlockedError extends SatrError {}
class SatrConfigError extends SatrError {}
class SatrRuleError extends SatrError {}
```

When action is `"block"` and issues are found:

```ts
throw new SatrBlockedError(result);
```

But `scanText` should not throw by default unless explicitly configured.

---

## 26. Middleware Examples

### Express Example

```ts
import express from "express";
import { scanObject } from "@satr-labs/core";

const app = express();

app.use(express.json());

app.post("/ai", async (req, res) => {
  const scan = scanObject(req.body, {
    rules: ["secrets", "pii", "pii-ar-sa"],
    action: "block",
  });

  if (!scan.safe) {
    return res.status(400).json({
      error: "Sensitive data detected.",
      issues: scan.issues,
    });
  }

  // Continue to AI provider...
});
```

### OpenAI Example

```ts
const scan = scanText(userPrompt, {
  rules: ["secrets", "pii"],
  action: "redact",
});

const response = await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "user",
      content: scan.output,
    },
  ],
});
```

### Anthropic Example

```ts
const scan = scanText(userPrompt, {
  rules: ["secrets", "pii"],
  action: "redact",
});

const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: scan.output,
    },
  ],
});
```

---

## 27. Documentation Requirements

The README must include:

- What is Satr?
- Why it exists
- Installation
- Quick start
- CLI usage
- SDK usage
- Rules overview
- Redaction overview
- Config example
- Supported detections
- Limitations
- Security model
- Roadmap
- License

README headline:

```md
# Satr

Protect sensitive data before it reaches AI.

Satr is a local-first AI data protection SDK for detecting, redacting, blocking, and reporting sensitive data in prompts, files, logs, and API payloads before they are sent to AI providers or external systems.
```

Installation:

```bash
pnpm add @satr-labs/core
```

CLI:

```bash
pnpm add -g @satr-labs/cli
```

Quick start:

```ts
import { scanText } from "@satr-labs/core";

const result = scanText("My API key is sk-xxxx", {
  rules: ["secrets"],
  action: "redact",
});

console.log(result.output);
```

---

## 28. Brand Identity

The project brand is independent.

Brand name:

```txt
Satr
```

Arabic companion:

```txt
ستر
```

Core meaning:

- concealment
- protection
- privacy
- trust
- shielded data flow

Brand personality:

- secure
- calm
- premium
- developer-first
- enterprise-ready
- local-first
- precise

Colors:

```txt
Primary teal: #00D1A3
Secondary teal: #0EA68A
Dark slate: #1B2330
Neutral gray: #8B97A6
Light gray: #E6E9ED
Background: near-black / dark navy
```

Typography:

```txt
Latin: Satoshi
Arabic: IBM Plex Sans Arabic
Code: Satoshi Mono or IBM Plex Mono
```

Product tone:

- clear
- technical
- confident
- not hype-driven
- security-aware
- honest about limitations

---

## 29. Security Model

Satr protects against:

- Accidental AI prompt leaks
- Secrets in prompts
- Secrets in logs
- Personal data in payloads
- Saudi PII exposure
- Internal business data exposure
- Unsafe debug sharing
- Unsafe support file sharing

Satr does not fully protect against:

- Malicious insiders
- Compromised machines
- Encrypted secrets
- Binary files in v0.1
- Images with text
- PDFs in v0.1
- Legal compliance by itself
- All possible PII formats
- All false positives or false negatives

The documentation should clearly state:

> Satr is a developer guardrail, not a complete compliance solution.

---

## 30. Testing Strategy

Testing is critical.

Use Vitest.

### Unit Tests

- `scanText` detects known patterns
- `scanText` does not detect clean text
- Redaction works correctly
- Risk score calculation works
- Severity threshold works
- Custom rules work
- Disabled rules are ignored
- Arabic text handling works
- Object scanning preserves structure
- Issue locations are correct

### Rule Tests

Each built-in rule needs:

- Positive examples
- Negative examples
- Edge cases
- False-positive checks

### CLI Tests

- `satr init` creates config
- `satr scan file` works
- `satr scan directory` works
- JSON output is valid
- Table output does not crash
- Ignore patterns work

### Fixture Examples

Create fixtures:

```txt
fixtures/
├─ clean/
│  ├─ safe-prompt.txt
│  └─ safe-code.ts
└─ sensitive/
   ├─ openai-key.env
   ├─ email.txt
   ├─ saudi-mobile.txt
   ├─ iban.txt
   └─ business-sensitive-ar.txt
```

---

## 31. Quality Requirements

The project should have:

- Strict TypeScript
- No implicit `any`
- Clean public API
- Meaningful errors
- Minimal dependencies
- Deterministic tests
- High test coverage for rules
- Clear documentation
- Strong examples
- Consistent formatting
- No external network calls in core scanner

---

## 32. MVP Definition

Satr v0.1 is complete when:

### Core

- `scanText` works
- `scanObject` works
- Redaction works
- Risk scoring works
- Custom rules work
- Built-in rules load correctly

### Rules

- Secrets rules implemented
- General PII rules implemented
- Saudi PII rules implemented
- Business-sensitive rules implemented

### Node

- `scanFile` works
- `scanDirectory` works
- Ignore patterns work
- Max file size works

### CLI

- `satr init` works
- `satr scan` works
- `satr rules list` works
- Table output works
- JSON output works

### Docs

- README complete
- Getting started guide complete
- Examples complete
- Limitations documented

### Tests

- Core tests pass
- Rule tests pass
- CLI smoke tests pass

---

## 33. Roadmap

### v0.1

- TypeScript core
- Node CLI
- Built-in rules
- Redaction
- Risk scoring
- Config
- Scan files/directories
- JSON/table output

### v0.2

- HTML report
- GitHub Action
- SARIF output
- Better Saudi ID validation
- More cloud secret rules
- Next.js middleware helper
- Express middleware helper

### v0.3

- Python SDK
- Laravel middleware
- Custom rule packs
- Rule marketplace concept
- Advanced false-positive suppression

### v1.0

- Stable public API
- Documentation website
- CI integrations
- Package badges
- Official examples
- Security policy
- Contribution guide

### Enterprise Later

- Dashboard
- Team policies
- Audit logs
- Private rule registry
- Compliance packs
- Self-hosted control plane
- Organization-level reporting

---

## 34. Naming Conventions

Packages:

```txt
@satr-labs/core
@satr-labs/node
@satr-labs/cli
@satr-labs/rules
```

CLI:

```txt
satr
```

Commands:

```txt
satr init
satr scan
satr rules list
satr explain <rule-id>
```

Rule IDs:

```txt
secret.openai_api_key
secret.anthropic_api_key
secret.github_token
secret.aws_access_key
secret.private_key
pii.email
pii.phone
pii.ip_address
pii.saudi_mobile
pii.saudi_iban
pii.saudi_national_id_candidate
business.salary_keyword
business.contract_keyword
business.employee_data_keyword
business.invoice_keyword
```

---

## 35. Example Built-in Rule IDs

```txt
secret.openai_api_key
secret.anthropic_api_key
secret.github_token
secret.aws_access_key_id
secret.private_key_block
secret.bearer_token
secret.database_url

pii.email
pii.ip_address
pii.url_token
pii.phone_candidate

pii_ar_sa.mobile
pii_ar_sa.iban
pii_ar_sa.national_id_candidate

business.salary
business.contract
business.employee_data
business.bank_account
business.confidential
```

---

## 36. Important Implementation Notes

### Avoid catastrophic regex

All regex patterns must be reviewed for performance.

Avoid patterns that can cause catastrophic backtracking.

### Compile rules once

Rules should be compiled once and reused.

### Preserve match locations

Every issue should include start/end offsets.

For file scans, include line/column.

### Avoid duplicate issues

If multiple rules match the exact same text range, consider deduplication or priority.

### Handle overlapping matches

If redactions overlap, sort by start index descending before replacing text.

### Unicode support

Arabic text must be handled correctly.

### No network calls

Core scanning must not call any external APIs.

### Minimal dependency philosophy

Keep dependencies small.

Suggested dependencies:

- zod
- commander
- fast-glob
- ignore
- chalk or picocolors
- ora optional
- tsup
- vitest

---

## 37. Development Plan

### Phase 1: Bootstrap

- Initialize pnpm monorepo
- Create packages
- Configure TypeScript
- Configure tsup
- Configure Vitest
- Add lint/format scripts

### Phase 2: Core Types

- Implement types
- Implement rule validation
- Implement `defineRule`
- Implement `defineSatrConfig`

### Phase 3: scanText

- Load rules
- Compile regex patterns
- Match text
- Generate issues
- Calculate risk score
- Return result

### Phase 4: Redaction

- Implement full redaction
- Implement partial redaction
- Implement mask redaction
- Implement remove redaction
- Handle overlapping ranges safely

### Phase 5: Built-in Rules

- Add secrets
- Add PII
- Add Saudi PII
- Add business-sensitive keywords

### Phase 6: scanObject

- Recursively scan strings
- Preserve object shape
- Add path to issues
- Redact object output

### Phase 7: Node Package

- Implement `scanFile`
- Implement `scanDirectory`
- Implement ignore
- Implement binary file skip
- Implement max file size

### Phase 8: CLI

- `satr init`
- `satr scan`
- `satr rules list`
- `satr explain`
- Table output
- JSON output

### Phase 9: Docs and Examples

- README
- Examples
- Threat model
- Limitations
- Config docs

### Phase 10: Release

- Changesets
- Package publishing
- GitHub repo cleanup
- MIT license
- npm package metadata

---

## 38. Example Final Developer Experience

### Install

```bash
pnpm add @satr-labs/core
```

### Use in code

```ts
import { scanText } from "@satr-labs/core";

const prompt = `
Please summarize this log:
OPENAI_API_KEY=sk-1234567890
User email: ahmad@example.com
`;

const result = scanText(prompt, {
  rules: ["secrets", "pii"],
  action: "redact",
});

if (!result.safe) {
  console.log("Sensitive data detected.");
  console.log(result.issues);
}

console.log(result.output);
```

Expected output:

```txt
Please summarize this log:
OPENAI_API_KEY=[REDACTED:OPENAI_API_KEY]
User email: [REDACTED:EMAIL]
```

### CLI

```bash
npx satr scan .
```

Output:

```txt
Satr Scan Report

Status: Unsafe
Risk Score: 95
Issues Found: 2

critical  secret.openai_api_key  .env       1:16
high      pii.email              logs.txt   4:12
```

---

## 39. Final Product Summary

Build Satr as a focused, local-first, deterministic data protection SDK for AI-era applications.

The MVP should prove one core value:

> Developers can prevent sensitive data from reaching AI systems with one simple SDK call or CLI command.

The project should be technically clean, security-aware, well-tested, and easy to integrate.

Do not over-engineer.

Prioritize:

1. Clean API
2. Accurate built-in rules
3. Reliable redaction
4. Useful CLI
5. Excellent documentation
6. Strong tests

The first public version should feel small but professional.

---

# Short System Prompt for AI Coding Assistants

Use this shorter prompt when starting a coding session with an AI assistant.

```md
You are helping me build an open-source TypeScript developer security tool called Satr.

Satr is a local-first AI data protection SDK and CLI. Its purpose is to detect, redact, block, and report sensitive data before prompts, files, logs, or API payloads are sent to AI providers or external systems.

Important principles:
- Local-first: no external API calls.
- Deterministic: use rules, regex, validators, and heuristics in v0.1.
- Developer-first: clean TypeScript API, CLI, excellent docs.
- Small MVP: do not overbuild with dashboards, LLMs, databases, or SaaS features.
- Brand is independent.

Tech stack:
- TypeScript
- Node.js
- pnpm workspaces
- tsup
- Vitest
- Zod
- Commander
- ESLint
- Prettier
- Changesets

Packages:
- @satr-labs/core: pure scanner, rules, redaction, risk scoring, scanText, scanObject
- @satr-labs/node: scanFile, scanDirectory, ignore patterns, filesystem utilities
- @satr-labs/cli: satr init, satr scan, satr rules list, satr explain
- @satr-labs/rules: built-in rule packs

v0.1 features:
- scanText
- scanObject
- scanFile
- scanDirectory
- built-in rules for secrets, PII, Saudi PII, and business-sensitive data
- redaction strategies: full, partial, mask, hash, remove
- risk scoring from 0 to 100
- CLI with table and JSON output
- satr.config.json
- .satrignore
- README and examples

Built-in rules should detect:
- OpenAI API keys
- Anthropic API keys
- GitHub tokens
- AWS access keys
- private key blocks
- bearer tokens
- database URLs
- emails
- IP addresses
- Saudi mobile numbers
- Saudi IBANs
- Saudi national ID / iqama candidates
- business-sensitive Arabic/English keywords such as salary, contract, employee, invoice, confidential, راتب, عقد, موظف, فاتورة, سري

Core API example:

import { scanText } from "@satr-labs/core";

const result = scanText(prompt, {
  rules: ["secrets", "pii", "pii-ar-sa"],
  action: "redact",
});

if (!result.safe) {
  console.log(result.issues);
}

console.log(result.output);

Build the project with strong architecture, clean code, strict TypeScript, tests, and documentation.
```
