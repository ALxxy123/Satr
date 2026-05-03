import { scanText } from "@satr-labs/core";
import { builtInRules } from "@satr-labs/rules";

const prompt = `
Please summarize this debug note before I send it to an AI provider.
OPENAI_API_KEY=sk-example1234567890abcdef
Customer email: ahmad@example.com
`;

const scan = scanText(prompt, {
  rules: ["secrets", "pii"],
  ruleRegistry: builtInRules,
  action: "redact",
});

if (!scan.safe) {
  console.log("Sensitive data detected:", scan.issues);
}

console.log(scan.output);
